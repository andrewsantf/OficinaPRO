'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/feature/Header'

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const publicPaths = ['/login', '/', '/pricing', '/updates', '/about', '/contact', '/blog', '/terms', '/privacy', '/lgpd']
    const isPublicPage = publicPaths.some(path => pathname === path || pathname?.startsWith(path + '/'))

    if (isPublicPage) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Header />
            {children}
        </div>
    )
}
