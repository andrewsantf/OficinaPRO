import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('organizations(subscription_status)')
        .eq('id', user.id)
        .single()

    // Handle nested relation
    const org: any = Array.isArray(profile?.organizations)
        ? profile?.organizations[0]
        : profile?.organizations

    const status = org?.subscription_status

    console.log('[DashboardLayout] User:', user.id)
    console.log('[DashboardLayout] Org:', org)
    console.log('[DashboardLayout] Status:', status)

    if (status !== 'active' && status !== 'trialing' && status !== 'lifetime') {
        redirect('/subscription')
    }

    return (
        <>
            {children}
        </>
    )
}
