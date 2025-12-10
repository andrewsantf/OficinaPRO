'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getCustomers() {
    const supabase = await createClient()

    // Simplificando o select para garantir que não falhe por campos nulos ou tipagem
    const { data: customers, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error("Error fetching customers:", error)
        return []
    }

    return customers || []
}

export async function updateCustomer(customerId: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const cpf_cnpj = (formData.get('cpf_cnpj') as string)?.replace(/\D/g, '')
    const address = formData.get('address') as string

    if (!name) return { error: "Nome é obrigatório" }

    const { error } = await supabase
        .from('customers')
        .update({
            name,
            phone,
            email: email || null,
            cpf_cnpj: cpf_cnpj || null,
            address: address || null
        })
        .eq('id', customerId)

    if (error) return { error: error.message }

    revalidatePath('/customers')
    revalidatePath(`/customers/${customerId}`)
    redirect('/customers')
}

export async function deleteCustomer(customerId: string) {
    const supabase = await createClient()

    // Check if customer has vehicles or OS?
    // Supabase foreign keys might prevent deletion if ON DELETE RESTRICT (default).
    // Let's rely on DB constraint error or delete cascade if configured.
    // If it fails, the user will see nothing happen (crappy UX without client handling).
    // For now, simple implementation.

    const { error } = await supabase.from('customers').delete().eq('id', customerId)

    if (error) {
        console.error("Error deleting customer:", error)
        throw new Error("Erro ao excluir cliente. Verifique se existem veículos vinculados.")
    }

    revalidatePath('/customers')
}
