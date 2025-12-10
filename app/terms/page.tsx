import { LandingFooter } from '@/components/layout/LandingFooter'
import { LandingHeader } from '@/components/layout/LandingHeader'

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-1 py-16 container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-2 text-slate-900">Termos de Uso</h1>
                <p className="text-sm text-slate-500 mb-8">Última atualização: 10 de Dezembro de 2025</p>

                <div className="space-y-6 text-slate-600 leading-relaxed">
                    <p>Bem-vindo ao OficinaPro. Ao acessar e usar nossa plataforma, você concorda com os seguintes termos:</p>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">1. O Serviço</h3>
                        <p>O OficinaPro é uma plataforma SaaS (Software as a Service) para gestão de oficinas mecânicas. Fornecemos ferramentas para controle de ordens de serviço, clientes, estoque e financeiro.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Assinatura e Cancelamento</h3>
                        <p>Não possuímos fidelidade. Você pode cancelar sua assinatura a qualquer momento através do painel de controle. O cancelamento entrará em vigor ao final do ciclo de cobrança atual.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Responsabilidades</h3>
                        <p>Nós nos esforçamos para manter o serviço disponível 99,9% do tempo, mas não nos responsabilizamos por perdas decorrentes de instabilidades momentâneas da internet ou de terceiros.</p>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
