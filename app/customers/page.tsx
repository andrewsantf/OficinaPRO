import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CustomerSearchList } from '@/components/feature/CustomerSearchList'
import { getCustomers } from './actions'

export default async function CustomersPage() {
    // getCustomers já trata erro e retorna array vazio se falhar
    const customers = await getCustomers()

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="-ml-3 h-8 w-8 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold">Clientes</h1>
                    </div>
                </div>
            </div>

            <CustomerSearchList customers={customers} />
        </div>
    )
}
