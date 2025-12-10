'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useState } from "react"
// We will implement the action later or use a placeholder
// import { updateOrganization } from '@/app/settings/actions'

interface OrganizationSettingsProps {
    initialName: string
    initialDocument: string
}

export function OrganizationSettings({ initialName, initialDocument }: OrganizationSettingsProps) {
    return (
        <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="org_name">Nome da Oficina / Empresa</Label>
                    <Input id="org_name" name="org_name" defaultValue={initialName} disabled />
                    <p className="text-xs text-muted-foreground">Para alterar, entre em contato com o suporte.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="doc_number">CPF / CNPJ</Label>
                    <Input id="doc_number" name="doc_number" defaultValue={initialDocument} disabled />
                </div>
            </div>
        </form>
    )
}
