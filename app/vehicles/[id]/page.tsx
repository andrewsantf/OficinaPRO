import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServiceOrder } from '@/app/service-orders/actions'
import { getFipeData } from '@/services/fipe'
import { Badge } from '@/components/ui/badge'

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: vehicle } = await supabase
        .from('vehicles')
        .select(`
            *,
            customers(*),
            service_orders(
                id,
                created_at,
                status,
                total_amount_cents
            )
        `)
        .eq('id', id)
        .single()

    if (!vehicle) return notFound()

    // Fetch FIPE Data if IDs are available
    let fipeData = null
    if (vehicle.brand_id && vehicle.model_id && vehicle.year_id) {
        try {
            fipeData = await getFipeData(vehicle.brand_id, vehicle.model_id, vehicle.year_id)
        } catch (error) {
            console.error("Failed to fetch FIPE data", error)
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-row justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <Link href="/vehicles">
                        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 text-muted-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl md:text-3xl font-bold">{vehicle.plate}</h1>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle>Dados do Veículo</CardTitle>
                            {fipeData && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                    FIPE: {fipeData.Valor}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>Marca/Modelo:</strong> {vehicle.brand} {vehicle.model}</p>
                        <p><strong>Cor:</strong> {vehicle.color}</p>
                        <p><strong>Ano:</strong> {vehicle.year}</p>
                        {fipeData && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Ref: {fipeData.MesReferencia}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>Nome:</strong> {vehicle.customers?.name}</p>
                        <p><strong>Telefone:</strong> {vehicle.customers?.phone}</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>Histórico de Serviços</CardTitle>
                        {/* @ts-expect-error Server Action binding type mismatch */}
                        <form action={createServiceOrder.bind(null, vehicle.id)} className="w-full md:w-auto">
                            <Button className="w-full md:w-auto">Nova O.S</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        {vehicle.service_orders && vehicle.service_orders.length > 0 ? (
                            <div className="grid grid-cols-1 overflow-x-auto w-full border rounded-md">
                                <table className="w-full text-sm min-w-full">
                                    <thead className="bg-slate-50 border-b">
                                        <tr>
                                            <th className="h-10 px-4 text-left font-medium whitespace-nowrap">Data</th>
                                            <th className="h-10 px-4 text-left font-medium whitespace-nowrap">Status</th>
                                            <th className="h-10 px-4 text-right font-medium whitespace-nowrap">Total</th>
                                            <th className="h-10 px-4 text-right font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicle.service_orders
                                            .filter((os: any) => os.total_amount_cents > 0)
                                            .map((os: any) => (
                                                <tr key={os.id} className="border-b last:border-0 hover:bg-slate-50/50">
                                                    <td className="p-4 whitespace-nowrap">{new Date(os.created_at).toLocaleDateString()}</td>
                                                    <td className="p-4 capitalize whitespace-nowrap">{os.status?.replace('_', ' ')}</td>
                                                    <td className="p-4 text-right whitespace-nowrap">
                                                        {(os.total_amount_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </td>
                                                    <td className="p-4 text-right whitespace-nowrap">
                                                        <Link href={`/service-orders/${os.id}`}>
                                                            <Button variant="ghost" size="sm">Abrir</Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Nenhuma ordem de serviço registrada.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
