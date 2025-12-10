'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Not authenticated" }

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    // Update 'profiles' table (assuming RLS allows update for own profile)
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            name,
            phone,
            updated_at: new Date().toISOString()
        })

    if (error) {
        return { error: error.message }
    }

    // Also try to update auth metadata for convenience
    await supabase.auth.updateUser({
        data: { full_name: name }
    })

    revalidatePath('/settings')
    return { success: true }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
        return { error: "A senha deve ter pelo menos 6 caracteres" }
    }

    if (password !== confirmPassword) {
        return { error: "As senhas não coincidem" }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/settings')
    return { success: true }
}
