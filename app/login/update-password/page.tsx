'use client'

import { updatePassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTransition } from 'react'
import { toast } from "sonner"
import { CheckCircle2, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function UpdatePasswordPage() {
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const password = formData.get('password') as string
            const confirmPassword = formData.get('confirm_password') as string

            if (password !== confirmPassword) {
                toast.error("Erro", {
                    description: "As senhas não coincidem."
                })
                return
            }

            const result = await updatePassword(formData)

            if (result && 'error' in result && result.error) {
                toast.error("Erro", {
                    description: result.error
                })
            } else if (result && 'message' in result && result.message) {
                toast.success("Sucesso", {
                    description: result.message
                })
            }
        })
    }

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            {/* Left Side: Branding */}
            <div className="hidden bg-slate-900 lg:flex flex-col justify-between p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full"></div>
                <div className="flex items-center gap-2 relative z-10">
                    <div className="bg-white/10 p-2 rounded backdrop-blur">
                        <LayoutDashboard size={24} className="text-blue-400" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">OficinaPro</span>
                </div>
                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-6 leading-tight">
                        Defina sua nova <br />
                        <span className="text-blue-400">senha de acesso.</span>
                    </h2>
                    <ul className="space-y-4 text-slate-300 mb-10">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-400" size={20} />
                            <span>Segurança reforçada</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center py-12 px-6 lg:px-8 bg-white">
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Atualizar Senha
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Digite sua nova senha abaixo.
                        </p>
                    </div>

                    <form action={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Nova Senha</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirm_password">Confirmar Senha</Label>
                            <Input id="confirm_password" name="confirm_password" type="password" required />
                        </div>

                        <Button type="submit" className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 mt-2" disabled={isPending}>
                            {isPending ? 'Atualizando...' : 'Atualizar Senha'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
