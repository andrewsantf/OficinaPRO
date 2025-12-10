import { LandingFooter } from '@/components/layout/LandingFooter'
import { LandingHeader } from '@/components/layout/LandingHeader'

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-1 py-16 container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-2 text-slate-900">Política de Privacidade</h1>
                <p className="text-sm text-slate-500 mb-8">Levamos seus dados a sério.</p>

                <div className="space-y-6 text-slate-600 leading-relaxed">
                    <p>Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.</p>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Coleta de Dados</h3>
                        <p>Coletamos apenas os dados necessários para o funcionamento do sistema, como nome, e-mail e dados da sua oficina para emissão de documentos.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Uso dos Dados</h3>
                        <p>Seus dados são usados exclusivamente para fornecer o serviço contratado. Não vendemos suas informações para terceiros.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Segurança</h3>
                        <p>Utilizamos criptografia de ponta a ponta e servidores seguros para garantir que suas informações estejam protegidas.</p>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
