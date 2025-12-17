'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, MessageCircle, TrendingUp, ShieldCheck, ArrowRight, LayoutDashboard, DollarSign, Wrench, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { LandingFooter } from '@/components/layout/LandingFooter'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/20 flex items-center justify-center text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-slate-900 tracking-tight">Oficina<span className="font-extrabold">PRO</span></span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/login?signup=true">
              <Button>Começar Agora</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-slate-50 border-b">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Novidade: Orçamentos via WhatsApp
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Do Pátio para o Bolso: <br className="hidden md:block" />
                <span className="text-blue-600">Sua Oficina Muito Mais Lucrativa.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0">
                Abandone as planilhas e o papel. Gerencie clientes, veículos e ordens de serviço em um único lugar, de qualquer dispositivo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/login?signup=true">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2">
                    Criar Conta Grátis <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12">
                    Conhecer Recursos
                  </Button>
                </Link>
              </div>
              <div className="pt-4 flex items-center justify-center md:justify-start gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-green-600" /> 3 dias de teste grátis
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-green-600" /> Cancele quando quiser
                </div>
              </div>
            </div>

            {/* Hero Image / Abstract Visual */}
            <div className="flex-1 w-full max-w-lg md:max-w-none relative">
              <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-20 rounded-full"></div>
              <div className="relative bg-white border rounded-2xl shadow-2xl p-2 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Mock Interface Header */}
                <div className="bg-slate-50 border-b p-3 flex items-center gap-2 rounded-t-xl">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                {/* Mock Content */}
                <div className="p-6 space-y-4 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-32 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white rounded-lg border shadow-sm p-4 space-y-2">
                      <div className="h-4 w-12 bg-slate-100 rounded"></div>
                      <div className="h-6 w-20 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-24 bg-white rounded-lg border shadow-sm p-4 space-y-2">
                      <div className="h-4 w-12 bg-slate-100 rounded"></div>
                      <div className="h-6 w-20 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-32 bg-white rounded-lg border shadow-sm p-4 space-y-2">
                    <div className="h-4 w-full bg-slate-100 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                    <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tudo que sua oficina precisa</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Desenvolvi o OficinaPro pensando nas dores de cabeça do dia a dia. Chega de perder anotações ou esquecer de cobrar peças.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<MessageCircle className="w-10 h-10 text-green-600" />}
                title="Orçamentos no WhatsApp"
                description="Envie orçamentos profissionais em PDF ou texto direto no WhatsApp do cliente com um clique."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-10 h-10 text-blue-600" />}
                title="Checklist Digital"
                description="Faça vistorias completas no celular, registre avarias e evite prejuízos. Profissionalismo na entrada do veículo."
              />
              <FeatureCard
                icon={<TrendingUp className="w-10 h-10 text-purple-600" />}
                title="Comissões Automáticas"
                description="Configure taxas por mecânico e deixe o sistema calcular quanto cada um deve receber. Fim das contas manuais."
              />
              <FeatureCard
                icon={<LayoutDashboard className="w-10 h-10 text-amber-600" />}
                title="CRM de Retenção"
                description="O sistema avisa quando o cliente deve voltar. Mande lembretes de revisão e aumente seu faturamento recorrente."
              />
              <FeatureCard
                icon={<CheckCircle2 className="w-10 h-10 text-indigo-600" />}
                title="Histórico Veicular"
                description="Saiba exatamente o que foi feito em cada carro. Fidelize clientes mostrando transparência e organização."
              />
              <FeatureCard
                icon={<DollarSign className="w-10 h-10 text-emerald-600" />}
                title="Gestão Financeira"
                description="Controle o caixa, saiba o lucro do mês e monitore pagamentos pendentes sem complicação."
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50 border-t">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Dúvidas Frequentes</h2>
              <p className="text-slate-600">
                Tire suas dúvidas e veja como o OficinaPro pode ajudar seu negócio.
              </p>
            </div>

            <div className="space-y-4">

              <FaqItem
                question="Funciona no celular e no computador?"
                answer="Sim! O OficinaPro é 100% online e responsivo. Você pode acessar do computador da oficina, do tablet ou do seu celular em qualquer lugar."
              />
              <FaqItem
                question="Posso cancelar quando quiser?"
                answer="Com certeza. Não temos fidelidade. Você pode cancelar sua assinatura a qualquer momento diretamente pelo painel do sistema."
              />
              <FaqItem
                question="Como funciona o envio de orçamentos?"
                answer="Você cria o orçamento no sistema e gera um link ou PDF. Com um clique, você envia direto para o WhatsApp do seu cliente. Simples e profissional."
              />
              <FaqItem
                question="O sistema emite Nota Fiscal?"
                answer="No momento focamos na gestão interna (ordens de serviço, financeiro e clientes). Em breve teremos integração para emissão fiscal."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para organizar sua oficina?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              Junte-se a centenas de mecânicos que estão profissionalizando seus negócios hoje mesmo.
            </p>
            <Link href="/login?signup=true">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-10 text-lg text-white border-none">
                Começar Teste Grátis
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl border bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300">
      <div className="mb-4 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm border">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-900 hover:bg-slate-50 transition-colors"
      >
        {question}
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
          {answer}
        </div>
      </div>
    </div>
  )
}
