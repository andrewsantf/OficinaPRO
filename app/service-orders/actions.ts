'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createServiceOrder(vehicleId: string, _formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Não autenticado" }

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile) return { error: "Perfil não encontrado" }

    const { data: order, error } = await supabase.from('service_orders').insert({
        organization_id: profile.organization_id,
        vehicle_id: vehicleId,
        status: 'draft',
        total_amount_cents: 0
    }).select().single()

    if (error) return { error: error.message }

    redirect(`/service-orders/${order.id}`)
}

export async function addItem(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Não autenticado" }

    const osId = formData.get('osId') as string
    const description = formData.get('description') as string
    const type = 'service'
    const quantity = parseFloat(formData.get('quantity') as string)
    const price = parseFloat(formData.get('price') as string)
    const mechanicId = formData.get('mechanicId') as string
    const materialCost = parseFloat(formData.get('materialCost') as string || '0')

    if (!description || !quantity || !price) return { error: "Dados inválidos" }

    const unitPriceCents = Math.round(price * 100)
    const materialCostCents = Math.round(materialCost * 100)
    let commissionRate = 0
    let commissionAmountCents = 0
    let finalMechanicId = null

    // Calculate Commission Logic
    if (type === 'service' && mechanicId && mechanicId !== 'none') {
        finalMechanicId = mechanicId

        // Fetch Mechanic Rate
        const { data: mechanic } = await supabase
            .from('mechanics')
            .select('commission_rate')
            .eq('id', mechanicId)
            .single()

        if (mechanic) {
            commissionRate = mechanic.commission_rate
            // Commission Base = (Total Service Price - Material Cost)
            // Example: Service 2000 - Material 700 = 1300 Base.
            const totalItemCents = unitPriceCents * quantity
            const commissionBaseCents = Math.max(0, totalItemCents - materialCostCents)

            commissionAmountCents = Math.round(commissionBaseCents * (commissionRate / 100))
        }
    }

    const { error } = await supabase.from('service_items').insert({
        service_order_id: osId,
        type,
        description,
        quantity,
        unit_price_cents: unitPriceCents,
        mechanic_id: finalMechanicId,
        commission_rate: commissionRate,
        commission_amount_cents: commissionAmountCents,
        material_cost_cents: materialCostCents
    })

    if (error) return { error: error.message }

    await updateOrderTotal(osId, supabase)
    revalidatePath(`/service-orders/${osId}`)
}

export async function removeItem(itemId: string, osId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('service_items').delete().eq('id', itemId)

    if (error) return { error: error.message }

    await updateOrderTotal(osId, supabase)
    revalidatePath(`/service-orders/${osId}`)
}

export async function updateStatus(osId: string, status: 'pending_approval' | 'approved' | 'finished' | 'paid') {
    const supabase = await createClient()

    // Validar se usuário tem permissão? RLS já cuida disso.

    const { error } = await supabase
        .from('service_orders')
        .update({ status })
        .eq('id', osId)

    if (error) return { error: error.message }

    revalidatePath(`/service-orders/${osId}`)
    return { success: true }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateOrderTotal(osId: string, supabase: any) {
    // Calculate new total
    const { data: items } = await supabase
        .from('service_items')
        .select('quantity, unit_price_cents')
        .eq('service_order_id', osId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = items?.reduce((acc: number, item: any) => {
        return acc + (item.quantity * item.unit_price_cents)
    }, 0) || 0

    await supabase
        .from('service_orders')
        .update({ total_amount_cents: total })
        .eq('id', osId)
}

export async function updateNextServiceDate(osId: string, date: Date | null) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('service_orders')
        .update({ next_service_date: date ? date.toISOString() : null })
        .eq('id', osId)

    if (error) {
        console.error("Error updating next service date:", error)
        return { error: 'Erro ao agendar retorno.' }
    }

    revalidatePath(`/service-orders/${osId}`)
    return { success: true }
}

export async function assignMechanic(osId: string, mechanicId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('service_orders')
        .update({ mechanic_id: mechanicId === 'none' ? null : mechanicId })
        .eq('id', osId)

    if (error) {
        console.error("Error assigning mechanic:", error)
        return { error: 'Erro ao definir mecânico.' }
    }

    revalidatePath(`/service-orders/${osId}`)
    return { success: true }
}
