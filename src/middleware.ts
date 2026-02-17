import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // Session validation is handled client-side in admin layout through /api/auth/me.
  // Avoid hard redirects here because backend auth cookie may live on a different origin.
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
