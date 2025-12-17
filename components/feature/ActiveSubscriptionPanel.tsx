'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Crown, CreditCard, CalendarDays, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ActiveSubscriptionPanelProps {
    status: 'active' | 'lifetime' | 'trialing' | 'canceled' | 'inactive'
    trialEnd?: string | null
    customerName?: string
}

export function ActiveSubscriptionPanel({ status, trialEnd }: ActiveSubscriptionPanelProps) {
    const isLifetime = status === 'lifetime'
    const [loadingPortal, setLoadingPortal] = useState(false)

    const handleManage = async () => {
        try {
            setLoadingPortal(true)
            const response = await fetch('/api/portal', { method: 'POST' })
            const data = await response.json()

            if (!response.ok) throw new Error(data.message || 'Erro ao abrir portal')

            window.location.href = data.url
        } catch (error) {
            console.error(error)
            toast.error("Erro ao redirecionar para o portal.")
        } finally {
            setLoadingPortal(false)
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">

            {/* Header Section */}
            <div className="text-center md:text-left space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                    {isLifetime ? (
                        <>
                            <Crown className="text-amber-500 fill-amber-500 h-8 w-8" />
                            <span>Membro Vitalício</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="text-green-500 h-8 w-8" />
                            <span>Assinatura Ativa</span>
                        </>
                    )}
                </h2>
                <p className="text-slate-500">
                    {isLifetime
                        ? 'Você possui acesso ilimitado e permanente a todos os recursos do OficinaPRO.'
                        : 'Sua assinatura está ativa e operando normalmente.'}
                </p>
            </div>

            {/* Main Status Card */}
            <Card className={`border-2 ${isLifetime ? 'border-amber-100 bg-amber-50/30' : 'border-green-100 bg-green-50/30'}`}>
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* Status Info */}
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-full ${isLifetime ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                <Crown size={32} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-slate-900">
                                    {isLifetime ? 'Plano Vitalício' : 'Plano Pro'}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className={`${isLifetime ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'} hover:bg-opacity-80`}>
                                        {isLifetime ? 'Ativo Permanentemente' : 'Renovação Automática'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Action Button (Only for non-lifetime active) */}
                        {!isLifetime && (
                            <Button
                                onClick={handleManage}
                                disabled={loadingPortal}
                                variant="outline"
                                className="w-full md:w-auto gap-2 border-slate-200 hover:bg-white hover:text-blue-600"
                            >
                                {loadingPortal ? 'Carregando...' : (
                                    <>
                                        <CreditCard size={16} />
                                        Gerenciar Assinatura
                                        <ExternalLink size={12} className="opacity-50" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureCard
                    icon={<Crown className="text-purple-500" />}
                    title="Recursos Premium"
                    description="Acesso total a checklists, CRM e relatórios avançados."
                />
                <FeatureCard
                    icon={<CalendarDays className="text-blue-500" />}
                    title="Suporte Prioritário"
                    description="Atendimento exclusivo para assinantes ativos."
                />
            </div>

        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card>
            <CardContent className="p-6 flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-50 rounded-lg">
                    {icon}
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900">{title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
