'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarClock } from 'lucide-react'
import { updateNextServiceDate } from '@/app/service-orders/actions'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ServiceReturnDateProps {
    osId: string
    currentDate: string | null
}

export function ServiceReturnDate({ osId, currentDate }: ServiceReturnDateProps) {
    const [date, setDate] = useState(currentDate ? currentDate.split('T')[0] : '')
    const [loading, setLoading] = useState(false)

    async function handleSave() {
        setLoading(true)
        const dateObj = date ? new Date(date) : null
        const result = await updateNextServiceDate(osId, dateObj)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Agendamento salvo!")
        }
    }

    function addMonths(months: number) {
        const d = new Date()
        d.setMonth(d.getMonth() + months)
        setDate(d.toISOString().split('T')[0])
    }

    return (
        <Card>
            <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-green-600" />
                    Agendar Retorno (CRM)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Sugestões</Label>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => addMonths(3)}>3 Meses</Button>
                            <Button variant="outline" size="sm" onClick={() => addMonths(6)}>6 Meses</Button>
                            <Button variant="outline" size="sm" onClick={() => addMonths(12)}>1 Ano</Button>
                        </div>
                    </div>

                    <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="next-date">Data Prevista</Label>
                            <Input
                                type="date"
                                id="next-date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
                            {loading ? '...' : 'Salvar'}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        O sistema avisará quando esta data estiver próxima.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
