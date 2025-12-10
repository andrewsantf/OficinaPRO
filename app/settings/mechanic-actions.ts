'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMechanics() {
    const supabase = await createClient()
    const { data } = await supabase.from('mechanics').select('*').order('name')
    return data || []
}

export async function createMechanic(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // We need organization_id. 
    // Ideally we fetch it from the user profile or check session.
    // For simplicity, let's rely on RLS insert policy which checks auth.uid() against profiles.
    // But we physically need to Insert the organization_id column if it's not null.
    // So we must fetch it.

    if (!user) return { error: "Unauthorized" }

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile) return { error: "Organization not found" }

    const name = formData.get('name') as string
    const rate = parseInt(formData.get('rate') as string)

    if (!name) return { error: "Nome obrigatório" }

    const { error } = await supabase.from('mechanics').insert({
        organization_id: profile.organization_id,
        name,
        commission_rate: rate || 0,
        active: true
    })

    if (error) {
        console.error(error)
        return { error: 'Erro ao criar prestador' }
    }

    revalidatePath('/settings')
    return { success: true }
}

export async function deleteMechanic(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('mechanics').delete().eq('id', id)

    if (error) {
        return { error: 'Erro ao excluir' }
    }


    revalidatePath('/settings')
    return { success: true }
}

export async function updateMechanic(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const rate = parseInt(formData.get('rate') as string)

    if (!id || !name) return { error: "Dados inválidos" }

    const { error } = await supabase.from('mechanics').update({
        name,
        commission_rate: rate || 0
    }).eq('id', id)

    if (error) {
        return { error: 'Erro ao atualizar' }
    }

    revalidatePath('/settings')
    return { success: true }
}
