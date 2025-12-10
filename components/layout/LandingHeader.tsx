import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'

export function LandingHeader() {
    return (
        <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                        <Wrench className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">OficinaPRO</span>
                </Link>
                <div className="flex gap-2 sm:gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Entrar</Button>
                        <Button variant="ghost" size="sm" className="sm:hidden px-2">Entrar</Button>
                    </Link>
                    <Link href="/login?signup=true">
                        <Button size="sm">Testar Grátis</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
