'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LayoutDashboard, Users, User, DollarSign, Settings, LogOut, Menu, Car } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import { logout } from "@/app/login/actions"
// Removed Separator import

export function MobileMenu() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] rounded-lg sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-left">Menu OficinaPro</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2 mt-2">
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg h-12">
                            <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
                        </Button>
                    </Link>

                    <Link href="/financial" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg h-12">
                            <DollarSign className="mr-3 h-5 w-5" /> Financeiro
                        </Button>
                    </Link>

                    <Link href="/customers" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg h-12">
                            <User className="mr-3 h-5 w-5" /> Clientes
                        </Button>
                    </Link>

                    <Link href="/vehicles" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg h-12">
                            <Car className="mr-3 h-5 w-5" /> Veículos
                        </Button>
                    </Link>

                    <Link href="/team" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg h-12">
                            <Users className="mr-3 h-5 w-5" /> Equipe
                        </Button>
                    </Link>

                    <Link href="/settings" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg h-12">
                            <Settings className="mr-3 h-5 w-5" /> Configurações
                        </Button>
                    </Link>

                    <div className="border-t my-2" />

                    <form action={logout}>
                        <Button variant="ghost" className="w-full justify-start text-lg h-12 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <LogOut className="mr-3 h-5 w-5" /> Sair
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
