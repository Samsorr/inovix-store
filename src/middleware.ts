import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD
  if (!password) return NextResponse.next()

  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Basic ')) {
    const [user, pass] = atob(auth.slice(6)).split(':')
    if (user === 'inovix' && pass === password) return NextResponse.next()
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Inovix"' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
