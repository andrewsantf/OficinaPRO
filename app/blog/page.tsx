import { LandingFooter } from '@/components/layout/LandingFooter'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { FileText, TrendingUp, Users } from 'lucide-react'

export default function BlogPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-1 py-16 container mx-auto px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Blog OficinaPro</h1>
                <p className="text-slate-600 mb-12">Dicas de gestão, mecânica e marketing para sua oficina.</p>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <article className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <TrendingUp className="w-16 h-16 text-blue-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="p-6 text-left">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Gestão</span>
                            <h3 className="text-lg font-bold mt-2 mb-2">Como aumentar o ticket médio da sua oficina</h3>
                            <p className="text-sm text-slate-600">Estratégias simples para vender mais serviços para o mesmo cliente.</p>
                        </div>
                    </article>

                    <article className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <FileText className="w-16 h-16 text-green-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="p-6 text-left">
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Finanças</span>
                            <h3 className="text-lg font-bold mt-2 mb-2">Fluxo de Caixa: Erros que você não pode cometer</h3>
                            <p className="text-sm text-slate-600">Aprenda a controlar as entradas e saídas sem dor de cabeça.</p>
                        </div>
                    </article>

                    <article className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                            <Users className="w-16 h-16 text-purple-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="p-6 text-left">
                            <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Marketing</span>
                            <h3 className="text-lg font-bold mt-2 mb-2">Fidelização: O segredo para o cliente voltar</h3>
                            <p className="text-sm text-slate-600">Por que o pós-venda é mais importante que a venda em si?</p>
                        </div>
                    </article>
                </div>

                <div className="mt-12 p-6 bg-slate-50 rounded-xl max-w-lg mx-auto">
                    <p className="text-slate-600 text-sm">
                        🚧 <strong>Em breve:</strong> Estamos preparando mais conteúdos exclusivos para você.
                        Fique ligado nas nossas redes sociais!
                    </p>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
