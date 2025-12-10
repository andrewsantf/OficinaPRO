import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Printer, ArrowLeft } from 'lucide-react'
import { ServiceOrderItems } from '@/components/feature/ServiceOrderItems'
import { ServiceOrderActions } from '@/components/feature/ServiceOrderActions'
import { WhatsAppButton } from '@/components/feature/WhatsAppButton'
import { ChecklistForm } from '@/components/feature/ChecklistForm'
import { ServiceReturnDate } from '@/components/feature/ServiceReturnDate'


import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ServiceOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: os } = await supabase
        .from('service_orders')
        .select(`
            *,
            vehicles (
                plate, brand, model, color,
                customers (name, phone)
            )
        `)
        .eq('id', id)
        .single()

    if (!os) return notFound()

    // Fetch items and checklist separately 
    const { data: items } = await supabase
        .from('service_items')
        .select('*')
        .eq('service_order_id', os.id)
        .select(`
            *,
            mechanics (name)
        `)
        .order('created_at', { ascending: true })

    const { data: checklist } = await supabase
        .from('service_checklists')
        .select('*')
        .eq('service_order_id', os.id)
        .single()

    // Fetch mechanics
    const { data: mechanics } = await supabase.from('mechanics').select('id, name').order('name')

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Link href="/vehicles">
                            <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 text-muted-foreground">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold">Ordem de Serviço #{os.id.slice(0, 8)}</h1>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{os.status}</Badge>
                        <span className="text-muted-foreground text-sm">{new Date(os.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <WhatsAppButton
                        phone={os.vehicles.customers.phone}
                        customerName={os.vehicles.customers.name}
                        vehicleModel={os.vehicles.model}
                        plate={os.vehicles.plate}
                        osId={os.id}
                        totalAmount={os.total_amount_cents}
                        status={os.status}
                    />
                    <ServiceOrderActions osId={os.id} status={os.status} />
                    <Link href={`/service-orders/${os.id}/print`} className="w-full md:w-auto">
                        <Button variant="outline" className="w-full md:w-auto gap-2" title="Imprimir">
                            <Printer size={16} />
                            Imprimir
                        </Button>
                    </Link>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vehicle Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Veículo & Cliente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p className="text-lg font-semibold">{os.vehicles.plate}</p>
                                <p>{os.vehicles.brand} {os.vehicles.model}</p>
                                <p className="text-sm text-gray-500">{os.vehicles.color}</p>
                                <hr className="my-2" />
                                <p className="font-medium">{os.vehicles.customers.name}</p>
                                <p className="text-sm">{os.vehicles.customers.phone}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Checklist Component Inject */}
                    <ChecklistForm serviceOrderId={os.id} initialData={checklist} />

                    {/* CRM Component Inject */}
                    <ServiceReturnDate osId={os.id} currentDate={os.next_service_date} />
                </div>

                {/* Items */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Serviços e Peças</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ServiceOrderItems osId={os.id} items={items || []} mechanics={mechanics || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
