import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Wrench, Users, LayoutDashboard } from 'lucide-react'
import { CRMDashboard } from '@/components/feature/CRMDashboard'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 1. Fetch Stats
    // Current Month Revenue
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

    // Revenue (Finished or Paid)
    const { data: revenueData } = await supabase
        .from('service_orders')
        .select('total_amount_cents')
        .gte('created_at', startOfMonth)
        .in('status', ['finished', 'paid'])

    const monthlyRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total_amount_cents || 0), 0) || 0

    // Costs (Material + Commission)
    const { data: costData } = await supabase
        .from('service_items')
        .select(`
            material_cost_cents,
            commission_amount_cents,
            service_orders!inner (
                status,
                created_at
            )
        `)
        .gte('service_orders.created_at', startOfMonth)
        .in('service_orders.status', ['finished', 'paid'])

    const totalCosts = costData?.reduce((acc, curr) => {
        const material = curr.material_cost_cents || 0
        const commission = curr.commission_amount_cents || 0
        return acc + material + commission
    }, 0) || 0

    // Fixed Expenses (Paid)
    const { data: expensesData } = await supabase
        .from('expenses')
        .select('amount_cents')
        .gte('payment_date', startOfMonth)
        .eq('status', 'paid')

    const totalExpenses = expensesData?.reduce((acc, curr) => acc + (curr.amount_cents || 0), 0) || 0

    const netProfit = monthlyRevenue - totalCosts - totalExpenses

    // Open Orders
    const { count: openOrdersCount } = await supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['draft', 'pending_approval', 'approved'])

    // Total Customers
    const { count: customersCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })

    return (
        <main className="container mx-auto p-4 md:p-8">

            <div className="flex flex-row items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-muted-foreground">Visão geral da sua oficina.</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Faturamento (Mês)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-1">{(monthlyRevenue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <p className="text-xs text-muted-foreground">O.S Finalizadas/Pagas</p>

                        <div className="mt-4 pt-4 border-t">
                            <div className={`text-lg font-bold mb-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {(netProfit / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                            <p className="text-xs text-muted-foreground">Lucro Líquido</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">O.S em Aberto</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-1">{openOrdersCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Em andamento</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-1">{customersCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Base ativa</p>
                    </CardContent>
                </Card>
            </div>

            {/* CRM Warnings */}
            <div className="mb-8">
                <CRMDashboard />
            </div>


        </main>
    )
}
