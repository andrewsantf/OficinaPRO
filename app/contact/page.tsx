import { LandingFooter } from '@/components/layout/LandingFooter'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-1 py-16 container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Fale Conosco</h1>

                <div className="grid gap-6">
                    <a
                        href="mailto:contato@oficinapro.com.br"
                        className="flex items-center gap-4 p-6 border rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">E-mail</h3>
                            <p className="text-slate-600">contato@oficinapro.com.br</p>
                        </div>
                    </a>

                    <a
                        href="https://wa.me/5561984275639"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-6 border rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">WhatsApp</h3>
                            <p className="text-slate-600">(61) 98427-5639</p>
                        </div>
                    </a>

                    <div className="flex items-center gap-4 p-6 border rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Localização</h3>
                            <p className="text-slate-600">Brasília, DF - Brasil</p>
                        </div>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    )
}
