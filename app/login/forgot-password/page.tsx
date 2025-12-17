'use client'

import { forgotPassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTransition } from 'react'
import { toast } from "sonner"
import { CheckCircle2, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await forgotPassword(formData)

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
                        Recupere o acesso à <br />
                        <span className="text-blue-400">sua oficina.</span>
                    </h2>
                    <ul className="space-y-4 text-slate-300 mb-10">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-400" size={20} />
                            <span>Segurança garantida</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-400" size={20} />
                            <span>Recuperação rápida</span>
                        </li>
                    </ul>
                </div>
                <div className="relative z-10 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <p className="text-lg text-slate-200 italic mb-4">
                        "Esquecer a senha acontece. Recuperar deve ser simples."
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center py-12 px-6 lg:px-8 bg-white">
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Esqueceu a senha?
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            Digite seu email para receber o link de redefinição.
                        </p>
                    </div>

                    <form action={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required />
                        </div>

                        <Button type="submit" className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 mt-2" disabled={isPending}>
                            {isPending ? 'Enviando...' : 'Enviar Link de Recuperação'}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <Link href="/login" className="text-muted-foreground hover:text-slate-900 flex items-center justify-center gap-2">
                            ← Voltar para o login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
