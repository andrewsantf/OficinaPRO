import { LandingFooter } from '@/components/layout/LandingFooter'
import { LandingHeader } from '@/components/layout/LandingHeader'

export default function LGPDPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-1 py-16 container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8 text-slate-900">LGPD (Lei Geral de Proteção de Dados)</h1>

                <div className="space-y-6 text-slate-600 leading-relaxed">
                    <p>O OficinaPro está em conformidade com a Lei nº 13.709/2018.</p>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">Seus Direitos</h3>
                        <ul className="space-y-2 ml-4">
                            <li className="flex gap-2">
                                <span className="font-semibold text-slate-800">Acesso:</span>
                                <span>Você pode solicitar uma cópia dos seus dados a qualquer momento.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-slate-800">Retificação:</span>
                                <span>Você pode corrigir dados incompletos ou inexatos.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-slate-800">Exclusão:</span>
                                <span>Você pode solicitar a exclusão da sua conta e de todos os dados associados.</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Encarregado de Dados (DPO)</h3>
                        <p>Para exercer seus direitos ou tirar dúvidas sobre dados, entre em contato através de <a href="mailto:dpo@oficinapro.com.br" className="text-blue-600 hover:underline">dpo@oficinapro.com.br</a></p>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
