import VehicleList from '@/components/feature/VehicleList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function VehiclesPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex flex-row justify-between items-center gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="-ml-3 h-8 w-8 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-xl md:text-3xl font-bold">Veículos</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/vehicles/new">
                        <Button size="sm" className="h-9 px-3">Novo</Button>
                    </Link>
                </div>
            </div>
            <VehicleList />
        </div>
    )
}
