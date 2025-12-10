'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveChecklist(serviceOrderId: string, formData: FormData) {
    const supabase = await createClient()

    const fuelLevel = formData.get('fuel_level') as string
    const notes = formData.get('notes') as string

    // Collect all checked items
    // We assume items are sent as "item_name": "on"
    const items: Record<string, boolean> = {}
    const checklistItems = ['step_tire', 'jack', 'wheel_wrench', 'triangle', 'manual', 'radio_face']

    checklistItems.forEach(item => {
        if (formData.get(item) === 'on') {
            items[item] = true
        } else {
            items[item] = false
        }
    })

    const { error } = await supabase
        .from('service_checklists')
        .upsert({
            service_order_id: serviceOrderId,
            fuel_level: fuelLevel,
            notes: notes,
            items: items
        }, { onConflict: 'service_order_id' })

    if (error) {
        console.error('Error saving checklist:', error)
        return { error: 'Erro ao salvar checklist' }
    }

    revalidatePath(`/service-orders/${serviceOrderId}`)
    return { success: true }
}
