import { LandingFooter } from '@/components/layout/LandingFooter'
import { LandingHeader } from '@/components/layout/LandingHeader'

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-1 py-16 container mx-auto px-4 max-w-4xl text-center">
                <h1 className="text-4xl font-bold mb-6">Sobre Nós</h1>
                <p className="text-xl text-slate-600 leading-relaxed mb-8">
                    Nascemos dentro de uma oficina. Sabemos que o dia a dia é corrido, sujo de graxa e cheio de imprevistos.
                    O OficinaPro foi criado para trazer a organização das grandes concessionárias para a sua oficina, de forma simples e acessível.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Nossa missão é ajudar mecânicos e donos de oficina a terem mais controle, mais lucro e, principalmente, mais tempo livre.
                </p>
            </main>

            <LandingFooter />
        </div>
    )
}
