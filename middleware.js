export const config = {
  matcher: '/((?!api).*)',
};

export default function middleware(request) {

  const url = new URL(request.url);

  const CANARY_URL = 'https://policyforge-v2.vercel.app';

  // =========================
  // CHECK EXISTING COOKIE
  // =========================

  const cookieHeader = request.headers.get('cookie') || '';

  let version = null;

  if (cookieHeader.includes('app-version=canary')) {
    version = 'canary';
  } else if (cookieHeader.includes('app-version=stable')) {
    version = 'stable';
  }

  // =========================
  // 60-40 SPLIT
  // =========================

  if (!version) {
    version = Math.random() < 0.60
      ? 'stable'
      : 'canary';
  }

  // =========================
  // ROUTING LOGIC
  // =========================

  let response;

  if (version === 'canary') {

    const rewriteUrl = new URL(
      url.pathname + url.search,
      CANARY_URL
    );

    response = Response.rewrite(rewriteUrl);

  } else {

    response = Response.next();

  }

  // =========================
  // SESSION PERSISTENCE
  // =========================

  response.headers.set(
    'Set-Cookie',
    `app-version=${version}; Path=/; Max-Age=2592000; SameSite=Lax; Secure`
  );

  return response;
}