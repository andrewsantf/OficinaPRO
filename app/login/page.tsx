'use client'

import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useTransition, Suspense } from 'react'
import { toast } from "sonner"
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, LayoutDashboard, User, Building2 } from 'lucide-react'
import Link from 'next/link'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function LoginForm() {
    const searchParams = useSearchParams()
    const signupMode = searchParams.get('signup') === 'true'
    const [isLogin, setIsLogin] = useState(!signupMode)
    const [isPending, startTransition] = useTransition()

    // Pickup state types
    const [docType, setDocType] = useState<'CPF' | 'CNPJ'>('CNPJ')
    const [docValue, setDocValue] = useState('')

    const formatDocument = (value: string, type: 'CPF' | 'CNPJ') => {
        const numbers = value.replace(/\D/g, '')

        if (type === 'CPF') {
            return numbers
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1')
        } else {
            return numbers
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1')
        }
    }

    const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatDocument(e.target.value, docType)
        setDocValue(formatted)
    }

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const action = isLogin ? login : signup
            // Append doc_type explicitly if in signup mode
            if (!isLogin) {
                formData.append('doc_type', docType)
                // Ensure doc_number is updated with controlled value if needed, 
                // though Input name="doc_number" handles it natively via FormData 
                // as long as the input has the value.
            }

            const result = await action(formData)

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
            {/* Left Side: Branding (Same as before) */}
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
                        A gestão da sua oficina, <br />
                        <span className="text-blue-400">profissional e simples.</span>
                    </h2>
                    <ul className="space-y-4 text-slate-300 mb-10">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-400" size={20} />
                            <span>Orçamentos via WhatsApp</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-400" size={20} />
                            <span>Histórico completo</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-400" size={20} />
                            <span>Controle financeiro</span>
                        </li>
                    </ul>
                </div>
                <div className="relative z-10 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <p className="text-lg text-slate-200 italic mb-4">
                        "O OficinaPro mudou a forma como eu atendo meus clientes."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-slate-300">CS</div>
                        <div>
                            <p className="font-semibold text-white">Carlos Silva</p>
                            <p className="text-xs text-slate-400">Dono da AutoCenter Silva</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center py-12 px-6 lg:px-8 bg-white overflow-y-auto">
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta grátis'}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            {isLogin
                                ? 'Acesse o painel da sua oficina.'
                                : 'Comece seus 3 dias de teste agora.'}
                        </p>
                    </div>

                    <form action={handleSubmit} className="grid gap-4">

                        {/* Signup Fields */}
                        {!isLogin && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="full_name">Seu Nome Completo</Label>
                                    <Input id="full_name" name="full_name" required placeholder="Ex: João da Silva" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Seu WhatsApp / Telefone</Label>
                                    <Input id="phone" name="phone" required placeholder="(11) 99999-9999" />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Você trabalha como?</Label>
                                    <RadioGroup defaultValue="CNPJ" onValueChange={(v) => { setDocType(v as 'CPF' | 'CNPJ'); setDocValue('') }} className="flex gap-4">
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                                            <RadioGroupItem value="CNPJ" id="r-cnpj" />
                                            <Label htmlFor="r-cnpj" className="cursor-pointer flex items-center gap-2"><Building2 size={16} /> Empresa (CNPJ)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-slate-50">
                                            <RadioGroupItem value="CPF" id="r-cpf" />
                                            <Label htmlFor="r-cpf" className="cursor-pointer flex items-center gap-2"><User size={16} /> Pessoa Física (CPF)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {docType === 'CNPJ' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="company_name">Nome da Oficina</Label>
                                        <Input id="company_name" name="company_name" required placeholder="Ex: Mecânica Silva" />
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="doc_number">{docType === 'CNPJ' ? 'CNPJ' : 'CPF'}</Label>
                                    <Input
                                        id="doc_number"
                                        name="doc_number"
                                        required
                                        placeholder={docType === 'CNPJ' ? '00.000.000/0001-00' : '000.000.000-00'}
                                        value={docValue}
                                        onChange={handleDocChange}
                                        maxLength={docType === 'CNPJ' ? 18 : 14}
                                    />
                                </div>
                            </>
                        )}

                        {/* Common Fields */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                                {isLogin && (
                                    <Link href="/login/forgot-password" className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-blue-600">
                                        Esqueceu?
                                    </Link>
                                )}
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        <Button type="submit" className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 mt-2" disabled={isPending}>
                            {isPending ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta Grátis')}
                        </Button>
                    </form>

                    <div className="grid gap-2 text-center text-sm">
                        {isLogin ? (
                            <p className="text-muted-foreground">
                                Não tem uma conta?{" "}
                                <button type="button" onClick={() => setIsLogin(false)} className="underline font-medium text-slate-900 hover:text-blue-600">
                                    Cadastre-se grátis
                                </button>
                            </p>
                        ) : (
                            <p className="text-muted-foreground">
                                Já tem uma conta?{" "}
                                <button type="button" onClick={() => setIsLogin(true)} className="underline font-medium text-slate-900 hover:text-blue-600">
                                    Fazer login
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
            <LoginForm />
        </Suspense>
    )
}
