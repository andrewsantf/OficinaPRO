import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// MOCK PRICE ID for testing if none provided
// In production, use your actual Stripe Price ID (e.g. price_1Pxxxx...)
const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1QTrrVAnXFmquqF5hKqXGv6r';

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

        if (!profile || !profile.organizations) {
            return new NextResponse('Organization not found', { status: 404 })
        }

        // Force cast to any to bypass Supabase complex typing for nested single relation
        // In a real app we would generate database types
        const org: any = Array.isArray(profile.organizations) ? profile.organizations[0] : profile.organizations

        let customerId = org.stripe_customer_id

        // 1. Create Stripe Customer if not exists
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


        const body = await req.json().catch(() => ({}))
        const planType = body.plan === 'yearly' ? 'yearly' : 'monthly'

        const PRICE_ID_MONTHLY = process.env.STRIPE_PRICE_ID || 'price_1QTrrVAnXFmquqF5hKqXGv6r';
        // TODO: Replace with actual Yearly Price ID from Stripe Dashboard
        const PRICE_ID_YEARLY = process.env.STRIPE_PRICE_ID_YEARLY || 'price_1SfC7C9Vhvx9REw5E2vZBa8L';

        const selectedPriceId = planType === 'yearly' ? PRICE_ID_YEARLY : PRICE_ID_MONTHLY

        // 2. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: selectedPriceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 3,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?canceled=true`,
            metadata: {
                organization_id: profile.organization_id,
                userId: user.id
            }
        })

        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.error('[STRIPE_CHECKOUT_ERROR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
