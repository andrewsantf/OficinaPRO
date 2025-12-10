import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { EditCustomerForm } from '@/components/feature/EditCustomerForm'

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
        <div className="container mx-auto py-10 max-w-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Editar Cliente</h1>
                <Link href="/customers" className="self-end md:self-auto">
                    <Button variant="outline">Voltar</Button>
                </Link>
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
