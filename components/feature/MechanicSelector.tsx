'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { assignMechanic } from '@/app/service-orders/actions'
import { toast } from 'sonner'
import { Wrench } from 'lucide-react'

interface Mechanic {
    id: string
    name: string
}

interface MechanicSelectorProps {
    osId: string
    initialMechanicId: string | null
    mechanics: Mechanic[]
}

export function MechanicSelector({ osId, initialMechanicId, mechanics }: MechanicSelectorProps) {
    const [mechanicId, setMechanicId] = useState<string>(initialMechanicId || '')
    const [loading, setLoading] = useState(false)

    async function handleChange(value: string) {
        setLoading(true)
        const result = await assignMechanic(osId, value)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            setMechanicId(value)
            toast.success("Mecânico definido!")
        }
    }

    return (
        <Card>
            <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-600" />
                    Responsável Técnico
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label>Selecione o Mecânico</Label>
                    <Select value={mechanicId} onValueChange={handleChange} disabled={loading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">-- Nenhum --</SelectItem>
                            {mechanics.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                    {m.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}
