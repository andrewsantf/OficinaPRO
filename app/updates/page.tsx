import { LandingFooter } from '@/components/layout/LandingFooter'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { Sparkles, Wrench } from 'lucide-react'

export default function UpdatesPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-1 py-16 container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8">Novidades e Atualizações</h1>

                <div className="space-y-12 relative border-l border-slate-200 pl-8 ml-4">
                    <div className="relative">
                        <div className="absolute -left-[41px] bg-blue-100 p-2 rounded-full border-4 border-white">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-blue-600 mb-1 block">Dezembro 2025</span>
                        <h2 className="text-xl font-bold mb-2">Novo Módulo de Fluxo de Caixa</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Lançamos uma reformulação completa no módulo financeiro. Agora você pode visualizar seu fluxo de caixa mensal, lucro líquido e despesas em gráficos intuitivos.
                            Também otimizamos a visualização para dispositivos móveis, permitindo controlar as finanças direto do pátio.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[41px] bg-slate-100 p-2 rounded-full border-4 border-white">
                            <Wrench className="w-5 h-5 text-slate-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500 mb-1 block">Novembro 2025</span>
                        <h2 className="text-xl font-bold mb-2">Checklist Digital</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Adeus papelada! Agora é possível realizar o checklist de entrada do veículo totalmente pelo celular, anexando fotos e observações que ficam salvas na Ordem de Serviço.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[41px] bg-slate-100 p-2 rounded-full border-4 border-white">
                            <Wrench className="w-5 h-5 text-slate-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-500 mb-1 block">Outubro 2025</span>
                        <h2 className="text-xl font-bold mb-2">Exportação de Relatórios</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Precisa enviar dados pro contador? Adicionamos a opção de exportar todos os seus relatórios financeiros e de serviços em formato Excel e PDF com um clique.
                        </p>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
