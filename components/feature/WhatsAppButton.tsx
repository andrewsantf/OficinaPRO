'use client'

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
    phone: string
    customerName: string
    vehicleModel: string
    plate: string
    osId: string
    totalAmount: number
    status: string
    senderName?: string
}

export function WhatsAppButton({ phone, customerName, vehicleModel, plate, osId, totalAmount, status, senderName }: WhatsAppButtonProps) {
    if (!phone) return null

    const handleSend = () => {
        // Remove non-digits
        const cleanPhone = phone.replace(/\D/g, '')
        // Ensure Brazil code if missing (Basic heuristic)
        const finalPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone

        const formattedTotal = (totalAmount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

        const finalSender = senderName || 'OficinaPro'

        let message = `Olá ${customerName}, aqui é da *${finalSender}*.\n`
        message += `Referente ao serviço no *${vehicleModel} (${plate})*.\n`

        if (status === 'draft' || status === 'pending_approval') {
            message += `O orçamento de *${formattedTotal}* está pronto para sua aprovação.`
        } else if (status === 'approved') {
            message += `O serviço foi aprovado e já estamos trabalhando no veiculo.`
        } else if (status === 'finished') {
            message += `O serviço foi concluído! Valor final: *${formattedTotal}*.\nJá pode vir buscar o veículo.`
        }

        const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

    return (
        <Button
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
        >
            <MessageCircle size={18} />
            Enviar no Whatsapp
        </Button>
    )
}
