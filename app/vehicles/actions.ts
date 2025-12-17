'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// We need to fetch the customer or create one on the fly?
// For MVP, we will just link to the organization.
// But the schema implies: vehicle -> customer -> organization.
// So we need a customer selector or a "Quick Customer" creator.
// Let's create a "Walk-in Customer" automatically if none selected, or ask user?
// For simplicity in MVP step 1: simple form just saves vehicle?
// Wait, database constraint: customer_id is NOT NULL.
// So we MUST have a customer.
// Strategy: Add a "Customer Name" and "Phone" field to the Vehicle Form.
// If customer exists by phone, link. If not, create.

export async function createVehicle(formData: FormData) {
    const supabase = await createClient()

    // 1. Get Organization ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "User not authenticated" }

    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()

    // Handling case where profile might be missing or organization undefined (should not happen in valid flow)
    // Ideally we should have a reliable way to get org_id.
    // For now, let's assume it exists or fail.
    // Actually, we can just use the policy `get_current_org_id()` but specifically for INSERTs 
    // we usually need to provide the column if the policy checks it?
    // Our RLS policy: `with check (organization_id = get_current_org_id())`
    // So we MUST send it.

    // NOTE: If profile is missing, we can't get org_id. 
    // We should probably ensure profile on signup. 
    // But let's assume we can fetch it. If not, we have a migration gap (creating org on signup).

    if (!profile?.organization_id) {
        // Fallback: Create organization if new user? 
        // For this demo, let's assume the org exists.
        return { error: "Organization not found for user." }
    }

    const organizationId = profile.organization_id

    // 2. Handle Customer
    const customerName = formData.get('customerName') as string
    const customerPhone = formData.get('customerPhone') as string
    const docNumber = (formData.get('docNumber') as string)?.replace(/\D/g, '')

    if (!customerName) return { error: "Nome do cliente obrigatório" }

    // Check if customer exists (by phone OR docNumber)
    let customerId = null
    let query = supabase.from('customers').select('id').eq('organization_id', organizationId)

    if (docNumber) {
        // If doc provided, strict check
        // Check if doc exists first (stronger identity)
        const { data: byDoc } = await supabase.from('customers').select('id').eq('organization_id', organizationId).eq('cpf_cnpj', docNumber).single()
        if (byDoc) customerId = byDoc.id
    }

    if (!customerId && customerPhone) {
        // Weak check by phone if doc not found/provided
        const { data: byPhone } = await supabase.from('customers').select('id').eq('organization_id', organizationId).eq('phone', customerPhone).single()
        if (byPhone) customerId = byPhone.id
    }

    if (!customerId) {
        const docType = docNumber.length > 11 ? 'CNPJ' : 'CPF'

        const { data: newCustomer, error: custError } = await supabase
            .from('customers')
            .insert({
                organization_id: organizationId,
                name: customerName,
                phone: customerPhone,
                doc_type: docType,
                // Use provided doc or a random fallback if absolutely necessary to avoid constraint violation?
                // Schema requires UNIQUE(org, doc_number) - wait, let's check schema.
                // Assuming it might fail if empty and we have unique constraint on empty string?
                // Ideally default to something unique if empty.
                // For now, let's save the cleaned number.
                cpf_cnpj: docNumber || null
            })
            .select()
            .single()

        if (custError) return { error: `Erro ao criar cliente: ${custError.message}` }
        customerId = newCustomer.id
    } else {
        // Update existing customer info if new info provided?
        // Ideally yes, but keeping it simple for now. 
        // Maybe update missing fields.
        if (docNumber) {
            await supabase.from('customers').update({ cpf_cnpj: docNumber }).eq('id', customerId)
        }
    }

    // 3. Create Vehicle
    const brand = formData.get('brandName') as string
    const model = formData.get('modelName') as string
    const year = parseInt(formData.get('year') as string)
    const plate = formData.get('plate') as string
    const color = formData.get('color') as string

    const brandId = formData.get('brandId') as string
    const modelId = formData.get('modelId') as string
    const yearId = formData.get('yearId') as string

    const { error: vehicleError } = await supabase.from('vehicles').insert({
        organization_id: organizationId,
        customer_id: customerId,
        plate,
        brand,
        model,
        year,
        color,
        brand_id: brandId,
        model_id: modelId,
        year_id: yearId
    })

    if (vehicleError) return { error: vehicleError.message }

    revalidatePath('/vehicles')
    redirect('/vehicles')
}

export async function deleteVehicle(vehicleId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId)

    if (error) {
        console.error("Error deleting vehicle:", error)
        throw new Error(error.message || "Erro ao excluir veículo")
    }

    revalidatePath('/dashboard')
    revalidatePath('/vehicles')
}


