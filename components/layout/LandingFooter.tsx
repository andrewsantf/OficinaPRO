'use client'

import Link from 'next/link'
import { Wrench, ChevronDown, Instagram, Facebook, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { useState } from 'react'

// Componente para seção colapsável no mobile
function FooterSection({ title, children, isLast = false }: { title: string; children: React.ReactNode; isLast?: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`${isLast ? '' : 'border-b border-slate-200'} md:border-0`}>
            {/* Header - clicável apenas no mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 md:py-0 md:cursor-default md:pointer-events-none"
            >
                <h3 className="font-semibold text-slate-900 text-sm md:text-base md:mb-4">{title}</h3>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 md:hidden ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {/* Conteúdo - sempre visível no desktop, colapsável no mobile */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out md:overflow-visible md:max-h-none ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'} md:block`}>
                {children}
            </div>
        </div>
    )
}

export function LandingFooter() {
    return (
        <footer className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
            <div className="container mx-auto px-4">

                {/* Main Footer Content */}
                <div className="py-10 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8">

                        {/* Brand Column - Sempre visível */}
                        <div className="md:col-span-4 pb-6 md:pb-0 border-b border-slate-200 md:border-0">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <Wrench className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="font-bold text-lg text-slate-900 tracking-tight">
                                        Oficina<span className="font-extrabold text-blue-600">PRO</span>
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                                        Gestão Inteligente
                                    </span>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-xs">
                                A plataforma completa para gestão de oficinas mecânicas, auto centers e estética automotiva.
                            </p>

                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 flex items-center justify-center text-slate-600 hover:text-white transition-all duration-300 group"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-600 flex items-center justify-center text-slate-600 hover:text-white transition-all duration-300"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-700 flex items-center justify-center text-slate-600 hover:text-white transition-all duration-300"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-600 flex items-center justify-center text-slate-600 hover:text-white transition-all duration-300"
                                    aria-label="YouTube"
                                >
                                    <Youtube className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        {/* Links Columns - Accordion no mobile */}
                        <div className="md:col-span-8 md:grid md:grid-cols-3 md:gap-8">
                            <FooterSection title="Produto">
                                <ul className="space-y-2.5 text-sm">
                                    <li>
                                        <Link href="/#features" className="text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                                            Recursos
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                                            Planos e Preços
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/updates" className="text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                                            Atualizações
                                        </Link>
                                    </li>
                                </ul>
                            </FooterSection>

                            <FooterSection title="Empresa">
                                <ul className="space-y-2.5 text-sm">
                                    <li>
                                        <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
                                            Sobre nós
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">
                                            Contato
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/blog" className="text-slate-600 hover:text-blue-600 transition-colors">
                                            Blog
                                        </Link>
                                    </li>
                                </ul>
                            </FooterSection>

                            <FooterSection title="Legal" isLast>
                                <ul className="space-y-2.5 text-sm">
                                    <li>
                                        <Link href="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">
                                            Termos de Uso
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">
                                            Privacidade
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/lgpd" className="text-slate-600 hover:text-blue-600 transition-colors">
                                            LGPD
                                        </Link>
                                    </li>
                                </ul>
                            </FooterSection>
                        </div>
                    </div>
                </div>

                {/* Contact Bar - Mobile Friendly */}
                <div className="py-6 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-slate-600">
                        <a
                            href="mailto:contato@oficinapro.com.br"
                            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                            <Mail className="h-4 w-4" />
                            <span>contato@oficinapro.com.br</span>
                        </a>
                        <a
                            href="https://wa.me/5561984275639"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-green-600 transition-colors"
                        >
                            <Phone className="h-4 w-4" />
                            <span>(61) 98427-5639</span>
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-slate-100">
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
                            © 2025 OficinaPro Tecnologia Ltda. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50"></div>
                            <span className="text-xs sm:text-sm text-slate-600 font-medium">
                                Sistemas Operacionais
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
