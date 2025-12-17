import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes logic
    if (user) {
        // Allow access to settings, api, and auth related routes
        if (!request.nextUrl.pathname.startsWith('/settings') &&
            !request.nextUrl.pathname.startsWith('/subscription') &&
            !request.nextUrl.pathname.startsWith('/api') &&
            !request.nextUrl.pathname.startsWith('/auth') &&
            !request.nextUrl.pathname.startsWith('/_next') &&
            !request.nextUrl.pathname.includes('.')) { // Exclude static files

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('organizations(subscription_status)')
                .eq('id', user.id)
                .single()

            if (error) {
                console.log('Middleware Profile Error:', error.message)
            }

            // Handle nested relation
            const org = Array.isArray(profile?.organizations)
                ? profile?.organizations[0]
                : profile?.organizations

            const status = org?.subscription_status

            console.log(`[Middleware] Path: ${request.nextUrl.pathname}, User: ${user.id}, Status: ${status}`)

            if (status !== 'active' && status !== 'trialing' && status !== 'lifetime') {
                console.log('[Middleware] Redirecting to subscription...')
                return NextResponse.redirect(new URL('/subscription', request.url))
            }
        }
    }

    return supabaseResponse
}
