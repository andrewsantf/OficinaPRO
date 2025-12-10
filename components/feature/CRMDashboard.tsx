import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Calendar } from 'lucide-react'
import Link from 'next/link'

export async function CRMDashboard() {
    const supabase = await createClient()

    // Date range: Today to +30 days
    const today = new Date().toISOString().split('T')[0]
    const next30Days = new Date()
    next30Days.setDate(next30Days.getDate() + 30)
    const limitDate = next30Days.toISOString().split('T')[0]

    const { data: recalls } = await supabase
        .from('service_orders')
        .select(`
            id,
            next_service_date,
            vehicles (
                plate, model,
                customers (name, phone)
            )
        `)
        .gte('next_service_date', today)
        .lte('next_service_date', limitDate)
        .order('next_service_date', { ascending: true })
        .limit(10)

    if (!recalls || recalls.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-500" />
                        Próximos Retornos (CRM)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Nenhum cliente agendado para os próximos 30 dias.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    Próximos Retornos (CRM)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {recalls.map((os) => {
                    const days = Math.ceil((new Date(os.next_service_date).getTime() - new Date(today).getTime()) / (1000 * 3600 * 24))

                    // Supabase join handling: access as objects because of single relationship, but cast as any to bypass strict type check for now or handle potential array
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const vehicle = os.vehicles as any
                    const customer = vehicle?.customers

                    const customerName = customer?.name || 'Cliente'
                    const phone = customer?.phone || ''
                    const model = vehicle?.model || 'Veículo'
                    const plate = vehicle?.plate || ''

                    // Format WhatsApp Link
                    const message = `Olá ${customerName}, tudo bem? Aqui é da Oficina. Seu ${model} está completando o prazo para a revisão de ${new Date(os.next_service_date).toLocaleDateString()}. Podemos agendar?`
                    const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

                    return (
                        <div key={os.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium">{customerName}</p>
                                <p className="text-xs text-muted-foreground">{model} - {plate}</p>
                                <p className="text-xs font-semibold text-indigo-600 mt-1">
                                    {days === 0 ? 'Hoje' : `Em ${days} dias`} ({new Date(os.next_service_date).toLocaleDateString()})
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Link href={whatsappUrl} target="_blank">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:bg-green-50" title="Enviar WhatsApp">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={`/service-orders/${os.id}`}>
                                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Ver O.S">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link h-4 w-4"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
