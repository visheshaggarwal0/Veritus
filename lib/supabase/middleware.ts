import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, { ...options, path: '/' })
          );
        },
      },
    }
  );

  // This is required for Next.js Cookie syncing.
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  if (error) {
    console.error("[Middleware] Auth error:", error.message);
  }

  const url = request.nextUrl.clone();



  // TEMPORARY BYPASS: Disabling redirection to allow UI verification
  /*
  if (user && (url.pathname === "/" || url.pathname === "/login")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (!user && url.pathname.startsWith('/dashboard')) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  */

  return response;
}






