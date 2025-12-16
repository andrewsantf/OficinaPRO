import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { EditCustomerForm } from '@/components/feature/EditCustomerForm'

import { ArrowLeft } from 'lucide-react'

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()

    if (!customer) return notFound()

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <div className="flex flex-row justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <Link href="/customers">
                        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 text-muted-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl md:text-3xl font-bold">Editar Cliente</h1>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    <EditCustomerForm customer={customer} />
                </CardContent>
            </Card>
        </div>
    )
}
