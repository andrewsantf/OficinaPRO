'use client'

import { useState } from "react"
import { SubscriptionCard } from "./SubscriptionCard"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface SubscriptionPlansProps {
    subStatus: string
    trialEnd?: string | null
}

export function SubscriptionPlans({ subStatus, trialEnd }: SubscriptionPlansProps) {
    const [isYearly, setIsYearly] = useState(false)

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl md:shadow-2xl border border-slate-100 ring-1 ring-slate-900/5 w-full max-w-md md:max-w-none transition-all duration-300">
            <div className="text-center mb-6 md:mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-slate-900" : "text-slate-500")}>
                        Mensal
                    </span>
                    <Switch
                        checked={isYearly}
                        onCheckedChange={setIsYearly}
                        className="data-[state=checked]:bg-blue-600"
                    />
                    <span className={cn("text-sm font-medium transition-colors", isYearly ? "text-slate-900" : "text-slate-500")}>
                        Anual <span className="text-xs text-green-600 font-bold ml-1">(-17%)</span>
                    </span>
                </div>

                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {isYearly ? 'Plano Pro Anual' : 'Plano Pro Mensal'}
                </span>

                <div className="mt-4 flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                        {isYearly ? 'R$970' : 'R$97'}
                    </span>
                    <span className="text-xl font-semibold text-slate-500">
                        {isYearly ? '/ano' : '/mês'}
                    </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                    {isYearly ? 'Economize R$194 por ano.' : 'Cancele a qualquer momento.'}
                </p>
            </div>

            <SubscriptionCard
                status={subStatus}
                trialEndDate={trialEnd}
                plan={isYearly ? 'yearly' : 'monthly'}
            />

            <div className="mt-6 text-center">
                <p className="text-xs text-slate-400">
                    Pagamento seguro processado e criptografado pelo Stripe.
                </p>
            </div>
        </div>
    )
}
