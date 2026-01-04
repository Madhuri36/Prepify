// middleware.js
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  /* ---------------- ROUTE RULES ---------------- */

  // Pages that REQUIRE login
  const protectedRoutes = [
    '/dashboard',
    '/settings',
    '/interview',
  ]

  // Auth pages
  const authRoutes = [
    '/auth/login',
    '/auth/signup',
  ]

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  const isAuthRoute = authRoutes.includes(pathname)

  /* ---------------- REDIRECT LOGIC ---------------- */

  // ❌ Not logged in → block protected routes
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // ✅ Logged in → prevent access to auth pages & landing page
  if (user && (pathname === '/' || isAuthRoute)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow request
  return response
}

/* ---------------- MATCHER ---------------- */

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)',
  ],
}
