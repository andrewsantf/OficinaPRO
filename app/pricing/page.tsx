import { LandingFooter } from '@/components/layout/LandingFooter'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-1 py-16">
                <div className="container mx-auto px-4 text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Investimento que se Paga</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Preço justo, sem surpresas e com retorno garantido para sua oficina.
                    </p>
                </div>

                <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-2 gap-8">
                    <div className="border rounded-2xl p-8 space-y-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-2xl font-bold text-slate-900">Mensal</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-slate-900">R$ 97</span>
                            <span className="text-slate-500">/mês</span>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-600 text-left">
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Tudo ilimitado</li>
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Clientes, Veículos e O.S.</li>
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Suporte via WhatsApp</li>
                        </ul>
                        <Link href="/login?signup=true" className="block">
                            <Button className="w-full h-12 text-lg">Começar Agora</Button>
                        </Link>
                    </div>

                    <div className="border-2 border-blue-600 rounded-2xl p-8 space-y-6 bg-slate-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">MAIS POPULAR</div>
                        <h3 className="text-2xl font-bold">Anual</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold">R$ 970</span>
                            <span className="text-slate-400">/ano</span>
                        </div>
                        <p className="text-blue-200 text-sm">Dois meses grátis (Economize R$ 194)</p>
                        <ul className="space-y-3 text-sm text-slate-300 text-left">
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Tudo do plano mensal</li>
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Treinamento exclusivo da equipe</li>
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Prioridade no suporte</li>
                        </ul>
                        <Link href="/login?signup=true" className="block">
                            <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white border-0">Assinar Anual</Button>
                        </Link>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
