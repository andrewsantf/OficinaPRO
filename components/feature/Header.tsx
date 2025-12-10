'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LayoutDashboard, DollarSign, Users, Settings, LogOut, Wrench } from 'lucide-react'
import { logout } from "@/app/login/actions"
import { MobileMenu } from './MobileMenu'

export function Header() {
    const pathname = usePathname()

    const getLinkStyle = (path: string) => {
        return pathname === path
            ? "bg-slate-900 text-white shadow-md hover:bg-slate-800 rounded-full px-4"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full px-4"
    }

    return (
        <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md relative w-full z-50 transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo / Brand */}
                <Link href="/dashboard" className="flex items-center gap-2.5 group cursor-pointer transition-opacity hover:opacity-80">
                    <div className="h-9 w-9 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <Wrench className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-lg text-slate-900 tracking-tight">Oficina<span className="font-extrabold">PRO</span></span>
                        <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Gestão Inteligente</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2 p-1 bg-slate-50/50 rounded-full border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className={getLinkStyle('/dashboard')}>
                            Dashboard
                        </Button>
                    </Link>

                    <div className="w-px h-4 bg-slate-300/50 mx-1" />

                    <Link href="/financial">
                        <Button variant="ghost" size="sm" className={getLinkStyle('/financial')}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Financeiro
                        </Button>
                    </Link>

                    <Link href="/customers">
                        <Button variant="ghost" size="sm" className={getLinkStyle('/customers')}>
                            Clientes
                        </Button>
                    </Link>

                    <Link href="/vehicles">
                        <Button variant="ghost" size="sm" className={getLinkStyle('/vehicles')}>
                            Veículos
                        </Button>
                    </Link>

                    <Link href="/team">
                        <Button variant="ghost" size="sm" className={getLinkStyle('/team')}>
                            <Users className="mr-2 h-4 w-4" />
                            Equipe
                        </Button>
                    </Link>

                    <div className="w-px h-4 bg-slate-300/50 mx-1" />

                    <Link href="/settings">
                        <Button variant="ghost" size="sm" className={getLinkStyle('/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            Configurações
                        </Button>
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="md:hidden">
                        <MobileMenu />
                    </div>

                    <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
                        <form action={logout}>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </header >
    )
}
