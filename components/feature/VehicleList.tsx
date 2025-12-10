import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { createServiceOrder } from '@/app/service-orders/actions'
import { Trash2 } from 'lucide-react'
import { deleteVehicle } from '@/app/vehicles/actions'
import { DeleteButton } from '@/components/feature/DeleteButton'

export default async function VehicleList() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: vehicles } = await supabase
        .from('vehicles')
        .select(`
            *,
            customers (name)
        `)
        .order('created_at', { ascending: false })

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles?.map((vehicle) => (
                <Card key={vehicle.id}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{vehicle.plate}</span>
                            <span className="text-sm font-normal text-muted-foreground">{vehicle.year}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">{vehicle.brand} {vehicle.model}</p>
                        <p className="text-sm text-gray-500">{vehicle.customers?.name}</p>

                        <div className="mt-4 flex gap-2 justify-between">
                            <div className="flex gap-2">
                                {/* @ts-expect-error Server Action binding */}
                                <form action={createServiceOrder.bind(null, vehicle.id)}>
                                    <Button size="sm">Nova O.S</Button>
                                </form>
                                <Link href={`/vehicles/${vehicle.id}`}>
                                    <Button variant="outline" size="sm">Ver Detalhes</Button>
                                </Link>
                            </div>
                            <DeleteButton
                                onDelete={deleteVehicle.bind(null, vehicle.id)}
                                title="Excluir Veículo"
                                description={`Tem certeza que deseja excluir o veículo placa ${vehicle.plate}?`}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
            {vehicles?.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                    Nenhum veículo encontrado.
                </div>
            )}
        </div>
    )
}
