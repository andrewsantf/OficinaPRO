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
            .select('organization_id, organizations(stripe_customer_id, name, document)')
            .eq('id', user.id)
            .single()

        // Cast to handle nested relation typing
        const org: any = Array.isArray(profile?.organizations)
            ? profile?.organizations[0]
            : profile?.organizations

        if (!profile || !org) {
            return new NextResponse('Organization not found', { status: 404 })
        }

        let customerId = org.stripe_customer_id

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: org.name,
                metadata: {
                    organization_id: profile.organization_id,
                    cnpj: org.document
                }
            })
            customerId = customer.id

            // Save customer ID to DB
            await supabase
                .from('organizations')
                .update({ stripe_customer_id: customerId })
                .eq('id', profile.organization_id)
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings`,
        })

        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.error('[STRIPE_PORTAL_ERROR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
