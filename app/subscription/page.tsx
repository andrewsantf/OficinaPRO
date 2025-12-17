import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SubscriptionPlans } from '@/components/feature/SubscriptionPlans'
import { ActiveSubscriptionPanel } from '@/components/feature/ActiveSubscriptionPanel'
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export default async function SubscriptionPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*, organizations(subscription_status, trial_ends_at)')
        .eq('id', user.id)
        .single()

    const org = Array.isArray(profile?.organizations)
        ? profile?.organizations[0]
        : profile?.organizations

    const subStatus = org?.subscription_status || 'inactive'
    const trialEnd = org?.trial_ends_at

    const isActiveOrLifetime = subStatus === 'active' || subStatus === 'lifetime'

    if (isActiveOrLifetime) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <ActiveSubscriptionPanel status={subStatus} trialEnd={trialEnd} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row items-center justify-center p-4 md:p-8 overflow-y-auto">
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 to-slate-100/50 pointer-events-none"></div>

            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start relative z-10 py-8 md:py-0">

                {/* 1. Intro Text */}
                <div className="text-center md:text-left order-1 md:col-start-1 md:row-start-1">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-3 md:mb-4">
                        Desbloqueie todo o potencial da sua <span className="text-blue-600">Oficina</span>.
                    </h1>
                    <p className="text-base md:text-lg text-slate-600">
                        Você está a um passo profissionalizar sua gestão. Teste grátis por 3 dias e cancele quando quiser.
                    </p>
                </div>

                {/* 2. Card (Mobile: Middle/Second, Desktop: Right Column) */}
                <div className="order-2 md:col-start-2 md:row-start-1 md:row-span-2 w-full flex justify-center md:block">
                    <SubscriptionPlans subStatus={subStatus} trialEnd={trialEnd} />
                </div>

                {/* 3. Benefits (Mobile: Bottom/Third, Desktop: Left Column under Intro) */}
                <div className="space-y-3 md:space-y-4 order-3 md:col-start-1 md:row-start-2">
                    <BenefitItem icon={<Zap className="text-amber-500" />} text="Acesso Imediato ao Dashboard Completo" />
                    <BenefitItem icon={<ShieldCheck className="text-green-500" />} text="Gestão Segura de Clientes e Veículos" />
                    <BenefitItem icon={<CheckCircle2 className="text-blue-500" />} text="Orçamentos Profissionais no WhatsApp" />
                </div>

            </div>
        </div>
    )
}

function BenefitItem({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all">
            <div className="p-2 bg-slate-50 rounded-lg">
                {icon}
            </div>
            <span className="font-medium text-slate-700">{text}</span>
        </div>
    )
}
