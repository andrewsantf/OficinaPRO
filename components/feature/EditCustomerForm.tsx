'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateCustomer } from '@/app/customers/actions'
import { formatDocument, formatPhone } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Customer {
    id: string
    name: string
    phone: string
    cpf_cnpj?: string
    email?: string
    address?: string
}

export function EditCustomerForm({ customer }: { customer: Customer }) {
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState(customer.phone || '')
    const [doc, setDoc] = useState(customer.cpf_cnpj || '')
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const result = await updateCustomer(customer.id, formData)

        if (result?.error) {
            toast.error(result.error)
            setLoading(false)
        } else {
            // Since the action redirects, we might not get here if it's successful and redirects.
            // But if we use revalidatePath there, we might stay here.
            // The action currently does redirect('/customers').
            // So this toast might not show if we redirect immediately.
            // But let's leave it.
            toast.success("Cliente atualizado!")
            // setLoading(false) // Component unmounts on redirect usually.
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input name="name" defaultValue={customer.name} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Celular</Label>
                    <Input
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cpf_cnpj">CPF ou CNPJ</Label>
                    <Input
                        name="cpf_cnpj"
                        value={doc}
                        onChange={(e) => setDoc(formatDocument(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={18}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" defaultValue={customer.email || ''} placeholder="email@exemplo.com" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input name="address" defaultValue={customer.address || ''} placeholder="Rua, Número, Bairro" />
            </div>

            <div className="pt-4">
                <Button className="w-full" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
        </form>
    )
}
