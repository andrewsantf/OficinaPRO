'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface SubscriptionCardProps {
    status: string // 'active' | 'inactive' | 'trial' | etc
}

interface SubscriptionCardProps {
    status: string
    trialEndDate?: string | null
}

export function SubscriptionCard({ status, trialEndDate }: SubscriptionCardProps) {
    const [loading, setLoading] = useState(false)

    const isActive = status === 'active' || status === 'trialing'

    // Calculate remaining days for trial
    let trialDaysRemaining = 0
    if (trialEndDate) {
        const today = new Date()
        const end = new Date(trialEndDate)
        const diffTime = Math.abs(end.getTime() - today.getTime())
        trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    async function handleSubscribe() {
        try {
            setLoading(true)
            const response = await fetch('/api/checkout', {
                method: 'POST',
            })

            if (!response.ok) {
                const text = await response.text()
                throw new Error(text || 'Falha ao iniciar checkout')
            }

            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error: any) {
            toast.error("Erro ao iniciar assinatura: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handlePortal() {
        try {
            setLoading(true)
            const response = await fetch('/api/portal', {
                method: 'POST',
            })

            if (!response.ok) {
                const text = await response.text()
                throw new Error(text || 'Falha ao abrir portal')
            }

            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error: any) {
            toast.error("Erro ao abrir portal: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className={isActive ? "border-green-200 bg-green-50/50" : "border-blue-200 bg-blue-50/50"}>
            <CardHeader>
                <CardTitle className={isActive ? "text-green-900" : "text-blue-900"}>Assinatura</CardTitle>
                <CardDescription>Gerencie seu plano e pagamentos.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="font-medium">Plano Atual: <span className="font-bold">OficinaPro Basic</span></p>
                        <p className="text-sm text-gray-500">
                            Status: <span className={isActive ? "text-green-600 font-bold uppercase" : "text-gray-600 uppercase"}>{status || 'Inativo'}</span>
                        </p>
                        {trialEndDate && isActive && (
                            <p className="text-sm text-amber-600 font-medium mt-1">
                                ⚠️ Período de teste acaba em {trialDaysRemaining} dias
                            </p>
                        )}
                    </div>

                    {!isActive ? (
                        <Button onClick={handleSubscribe} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Assinar Agora (3 dias Grátis)
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={handlePortal}>
                            Gerenciar Assinatura
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
