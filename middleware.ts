import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const response = await updateSession(request)

    // Optional: Add specific subscription check if user is logged in
    // Note: 'updateSession' already handles refreshing tokens. 
    // To strictly block access, we would need to check db status here.
    // However, for performance, basic middleware usually just checks auth.
    // We will trust the app layout or specific page checks for granular permissions usually, 
    // but to FORCE subscribe, we can add a check if we want to query Supabase here.

    // For now, let's keep it simple: relying on 'updateSession' to return the response.
    // If we want to block /dashboard for non-subscribers:
    /*
    const supabase = createServerClient(...) // Needs simpler client for middleware
    const { data: { user } } = await supabase.auth.getUser()
    if (user && !request.nextUrl.pathname.startsWith('/settings')) {
       // check profile... 
    }
    */
    // Given complexity of middleware DB calls, it's often better to do this in the Layout or a protected Route wrapper.
    // BUT user requested 'When creating account, force enter card'.
    // Best place: The Dashboard Layout. If not active, redirect to /settings.

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
