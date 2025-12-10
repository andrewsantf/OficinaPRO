import CustomerList from '@/components/feature/CustomerList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams
    const search = params.q

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

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <form>
                        <Input
                            name="q"
                            placeholder="Buscar por nome ou CPF..."
                            className="pl-8"
                            defaultValue={search}
                        />
                    </form>
                </div>
            </div>

            <CustomerList search={search} />
        </div>
    )
}
