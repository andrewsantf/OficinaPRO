'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createExpense(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

    if (!profile?.organization_id) return { error: 'Organization not found' }

    const description = formData.get('description') as string
    const amountStr = formData.get('amount') as string
    const dueDate = formData.get('due_date') as string
    const category = formData.get('category') as string

    // Parse amount: "R$ 1.234,56" -> 123456
    // Remove non-digits
    const cleanAmount = amountStr ? amountStr.replace(/\D/g, '') : '0'
    const amount = parseInt(cleanAmount)

    if (!description || !amount || !dueDate) {
        return { error: 'Campos obrigatórios faltando' }
    }

    const { error } = await supabase.from('expenses').insert({
        organization_id: profile.organization_id,
        description,
        amount_cents: amount,
        due_date: dueDate,
        category: category || 'fixed',
        status: 'pending'
    })

    if (error) {
        console.error('Error creating expense:', error)
        return { error: 'Erro ao criar despesa' }
    }

    revalidatePath('/financial')
    return { success: true }
}

export async function updateExpense(id: string, data: {
    description?: string
    amount_cents?: number
    due_date?: string
}) {
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {}
    if (data.description) updateData.description = data.description
    if (data.amount_cents) updateData.amount_cents = data.amount_cents
    if (data.due_date) updateData.due_date = data.due_date

    const { error } = await supabase.from('expenses').update(updateData).eq('id', id)

    if (error) {
        console.error('Error updating expense:', error)
        return { error: 'Erro ao atualizar despesa' }
    }

    revalidatePath('/financial')
    return { success: true }
}

export async function deleteExpense(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('expenses').delete().eq('id', id)

    if (error) return { error: 'Erro ao excluir' }

    revalidatePath('/financial')
    return { success: true }
}

export async function toggleExpenseStatus(id: string, currentStatus: string) {
    const supabase = await createClient()

    // If pending -> paid (today or keep null? usually today)
    // If paid -> pending (clear date)

    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending'
    const paidDate = newStatus === 'paid' ? new Date().toISOString() : null

    const { error } = await supabase.from('expenses').update({
        status: newStatus,
        payment_date: paidDate
    }).eq('id', id)

    if (error) return { error: 'Erro ao atualizar status' }

    revalidatePath('/financial')
    revalidatePath('/dashboard') // Since it affects Net Profit
    return { success: true }
}

export async function getExpenses(options?: { month?: string, status?: string }) {
    const supabase = await createClient()

    let query = supabase
        .from('expenses')
        .select('*')
        .order('due_date', { ascending: true })

    if (options?.month) {
        const start = `${options.month}-01`
        const [y, m] = options.month.split('-').map(Number)
        const nextMonth = new Date(y, m, 1).toISOString().split('T')[0]
        query = query.gte('due_date', start).lt('due_date', nextMonth)
    }

    if (options?.status) {
        query = query.eq('status', options.status)
    }

    const { data, error } = await query

    if (error) return []
    return data
}

export async function getFinancialStatement(month?: string) {
    const supabase = await createClient()

    // Define date range - usando mesmo formato do dashboard que funciona
    const now = new Date()
    const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Parse month string 'YYYY-MM'
    const [year, monthNum] = targetMonth.split('-').map(Number)

    // Start of month - usando mesmo formato do dashboard
    const startDate = new Date(year, monthNum - 1, 1) // monthNum - 1 porque JS é 0-indexed
    const startStr = startDate.toISOString()

    // End date (start of next month)
    const endDate = new Date(year, monthNum, 1) // próximo mês
    const endStr = endDate.toISOString()

    console.log('Financial Statement Query:', { targetMonth, startStr, endStr })

    // 1. INCOMES (Service Orders)
    // We consider 'finished' or 'paid' as realized revenue for this view, matches dashboard.
    console.log('Query params:', { startStr, endStr, statuses: ['finished', 'paid'] })

    const { data: orders, error: ordersError } = await supabase
        .from('service_orders')
        .select('id, total_amount_cents, created_at, status')
        .gte('created_at', startStr)
        .lt('created_at', endStr)
        .in('status', ['finished', 'paid'])
        .order('created_at', { ascending: false })

    if (ordersError) {
        console.error('Error fetching orders:', JSON.stringify(ordersError))
    }
    console.log('Orders found:', orders?.length || 0, 'Data:', JSON.stringify(orders?.slice(0, 2)))

    // 2. COSTS (Materials + Commissions linked to those orders)
    // We need to fetch items for these orders to calculate the variable cost (COGS)
    // It's easier to fetch all items for the period's finished orders
    const { data: items } = await supabase
        .from('service_items')
        .select('service_order_id, material_cost_cents, commission_amount_cents')
        .in('service_order_id', orders?.map(o => o.id) || [])

    // Calculate total variable costs
    const totalVariableCosts = items?.reduce((acc, item) => {
        return acc + (item.material_cost_cents || 0) + (item.commission_amount_cents || 0)
    }, 0) || 0

    // 3. EXPENSES (Fixed/recurring)
    // Filter by payment_date (cash basis) or due_date (accrual). 
    // Dashboard uses payment_date for 'ExpensesData'. Let's stick to that for 'Paid' view.
    // But user might want to see 'Accounts Payable' too? Use 'Paid' for Balance.
    const { data: expenses } = await supabase
        .from('expenses')
        .select('id, description, amount_cents, payment_date, category')
        .gte('payment_date', startStr)
        .lt('payment_date', endStr)
        .eq('status', 'paid')
        .order('payment_date', { ascending: false })

    // 4. PREPARE DATA
    const incomes = orders?.map(o => {
        return {
            id: o.id,
            type: 'income' as const,
            date: o.created_at,
            description: `Serviço #${o.id.slice(0, 8)}`,
            amount: o.total_amount_cents || 0,
            category: 'Serviços'
        }
    }) || []

    const outflows = expenses?.map(e => ({
        id: e.id,
        type: 'expense' as const,
        date: e.payment_date,
        description: e.description,
        amount: e.amount_cents,
        category: e.category || 'Fixa'
    })) || []

    const transactions = [...incomes, ...outflows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const totalRevenue = incomes.reduce((acc, curr) => acc + curr.amount, 0)
    const totalFixedExpenses = outflows.reduce((acc, curr) => acc + curr.amount, 0)
    const netProfit = totalRevenue - totalVariableCosts - totalFixedExpenses

    return {
        summary: {
            totalRevenue,
            totalVariableCosts,
            totalFixedExpenses,
            netProfit
        },
        transactions
    }
}
