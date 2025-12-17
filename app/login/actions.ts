'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // New Fields
    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const doc_type = formData.get('doc_type') as string
    const doc_number = (formData.get('doc_number') as string)?.replace(/\D/g, '') // Remove mascara
    let company_name = formData.get('company_name') as string

    // Fallback logic for company name if CPF
    if (!company_name) {
        company_name = `${full_name.split(' ')[0]} Oficina`
    }

    const { error, data: authData } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                full_name,
                phone,
                doc_type,
                doc_number,
                company_name
            }
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (authData.session) {
        revalidatePath('/', 'layout')
        redirect('/subscription')
    }

    return { message: 'Verifique seu email para continuar.' }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')
    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/login/update-password`,
    })

    if (error) {
        return { error: 'Não foi possível enviar o email de recuperação. Verifique o email informado.' }
    }

    return { message: 'Link de recuperação enviado! Verifique seu email.' }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string

    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if (error) {
        return { error: 'Erro ao atualizar a senha. Tente novamente.' }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
