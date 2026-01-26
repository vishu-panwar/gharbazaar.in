import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // This middleware will handle role-based routing
  const path = request.nextUrl.pathname

  // Check if accessing protected routes
  if (path.startsWith('/dashboard') || path.startsWith('/employee') || path.startsWith('/admin')) {
    // In production, verify JWT token here
    // For now, we'll check localStorage on client side
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/employee/:path*', '/admin/:path*'],
}
