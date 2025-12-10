'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from '@/app/settings/actions'
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatPhone } from "@/lib/utils"

interface ProfileFormProps {
    initialName: string
    initialPhone: string
    displayCpf?: string
}

export function ProfileForm({ initialName, initialPhone, displayCpf }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState(initialPhone || '')
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        // Ensure the phone in formData is the masked one or unmasked depending on backend? 
        // HTML form submission usually takes the input value. 
        // But since we are intercepting with server action, we pass the FormData directly.
        // It will take the valid input value.
        const result = await updateProfile(formData)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Perfil atualizado com sucesso!")
            router.refresh()
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input name="name" defaultValue={initialName} placeholder="Seu nome" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                    />
                </div>
                {displayCpf && (
                    <div className="space-y-2">
                        <Label>CPF</Label>
                        <Input value={displayCpf} disabled className="bg-slate-50" />
                    </div>
                )}
            </div>
            <Button disabled={loading}>{loading ? 'Salvando...' : 'Salvar Perfil'}</Button>
        </form>
    )
}
