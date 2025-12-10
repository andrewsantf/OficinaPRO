import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('organizations(stripe_customer_id)')
            .eq('id', user.id)
            .single()

        // Cast to handle nested relation typing
        const org: any = Array.isArray(profile?.organizations)
            ? profile?.organizations[0]
            : profile?.organizations

        if (!org?.stripe_customer_id) {
            return new NextResponse('No Stripe Customer found', { status: 404 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: org.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings`,
        })

        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.error('[STRIPE_PORTAL_ERROR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
