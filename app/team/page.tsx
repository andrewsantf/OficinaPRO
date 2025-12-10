import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { MechanicList } from '@/components/feature/MechanicList'
import { getMechanics } from '@/app/settings/mechanic-actions'
import { CommissionReport } from '@/components/feature/CommissionReport'

export default async function TeamPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const mechanics = await getMechanics()

    // Calculate Commissions (Server Side Logic - Item Based)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

    const { data: items } = await supabase
        .from('service_items')
        .select(`
            mechanic_id,
            commission_amount_cents,
            quantity,
            unit_price_cents,
            material_cost_cents,
            mechanics (name, commission_rate),
            service_orders!inner (status, created_at)
        `)
        .gte('service_orders.created_at', startOfMonth)
        .in('service_orders.status', ['finished', 'paid'])
        .not('mechanic_id', 'is', null)

    // Group by Mechanic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commissionMap = new Map<string, { mechanicId: string, name: string, rate: number, total: number, commission: number, count: number, materialCost: number }>()

    if (items) {
        items.forEach(item => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mech = item.mechanics as any
            if (!mech) return

            const key = item.mechanic_id
            if (!key) return

            if (!commissionMap.has(key)) {
                commissionMap.set(key, {
                    mechanicId: key,
                    name: mech.name,
                    rate: mech.commission_rate,
                    total: 0,
                    commission: 0,
                    count: 0,
                    materialCost: 0
                })
            }
            const current = commissionMap.get(key)!
            // Total produced by mechanic = quantity * unit_price
            current.total += (item.quantity * item.unit_price_cents)
            // Commission already calculated and stored in item
            current.commission += (item.commission_amount_cents || 0)
            current.count += 1
            current.materialCost += (item.material_cost_cents || 0)
        })
    }

    const reportData = Array.from(commissionMap.values()).map(c => ({
        mechanicId: c.mechanicId,
        mechanicName: c.name,
        totalServices: c.total,
        commissionRate: c.rate,
        commissionValue: c.commission,
        ordersCount: c.count,
        totalMaterialCost: c.materialCost
    }))



    return (
        <>
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="md:hidden">
                                <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 text-muted-foreground">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold">Equipe e Comissões</h1>
                        </div>
                        <p className="text-muted-foreground">Gerencie seus mecânicos e acompanhe a produtividade.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <MechanicList initialMechanics={mechanics || []} />
                    <CommissionReport mechanics={mechanics || []} data={reportData} />
                </div>
            </div>
        </>
    )
}
