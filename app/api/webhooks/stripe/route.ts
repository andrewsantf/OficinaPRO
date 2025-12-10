import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;
    const supabase = await createClient();

    if (event.type === 'checkout.session.completed') {
        const subscriptionId = session.subscription;
        const customerId = session.customer;
        const organizationId = session.metadata?.organization_id;


        if (!organizationId) {
            console.error('Missing organization_id in webhook metadata');
            return new NextResponse('Missing metadata', { status: 400 });
        }

        // Retrieve subscription to get trial details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
        const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;

        // Update organization status to active (or trialing)
        await supabase
            .from('organizations')
            .update({
                subscription_status: subscription.status, // 'trialing' or 'active'
                subscription_id: subscriptionId,
                stripe_customer_id: customerId,
                trial_ends_at: trialEnd
            })
            .eq('id', organizationId);
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscriptionId = session.subscription;
        // Find org by subscription_id and renew
        // (For MVP, payment succeeded usually implies active, logic is similar to above but we might not have metadata in invoice object directly without expansion)
        // Usually we look up by customer_id or subscription_id

        await supabase
            .from('organizations')
            .update({ subscription_status: 'active' })
            .eq('subscription_id', subscriptionId);
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscriptionId = session.subscription;
        await supabase
            .from('organizations')
            .update({ subscription_status: 'canceled' })
            .eq('subscription_id', subscriptionId);
    }

    return new NextResponse(null, { status: 200 });
}
