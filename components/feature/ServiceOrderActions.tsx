'use client'

import { Button } from "@/components/ui/button"
import { updateStatus } from "@/app/service-orders/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ServiceOrderActions({ osId, status }: { osId: string, status: string }) {
    const router = useRouter()

    async function handleUpdateStatus(newStatus: 'pending_approval' | 'approved' | 'finished' | 'paid') {
        const result = await updateStatus(osId, newStatus)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Status atualizado!")
            router.refresh()
        }
    }

    if (status === 'draft') {
        return (
            <Button onClick={() => handleUpdateStatus('pending_approval')} className="bg-green-600 hover:bg-green-700">
                Finalizar Orçamento
            </Button>
        )
    }

    if (status === 'pending_approval') {
        return (
            <div className="flex gap-2">
                <Button onClick={() => handleUpdateStatus('approved')} className="bg-blue-600 hover:bg-blue-700">
                    Aprovar Serviço
                </Button>
            </div>
        )
    }

    if (status === 'approved') {
        return (
            <Button onClick={() => handleUpdateStatus('finished')} variant="outline">
                Marcar como Concluído
            </Button>
        )
    }

    return null
}
