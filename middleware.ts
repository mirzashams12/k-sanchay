import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
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
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { pathname } = request.nextUrl;

    // Helper to redirect
    const redirect = (path: string) => {
        const url = request.nextUrl.clone();
        url.pathname = path;
        return NextResponse.redirect(url);
    };

    // This will refresh the session if needed and validate the user
    const { data: { user } } = await supabase.auth.getUser();

    //the role is in the profile table based on the user.id, it needs to be fetched from supabse db
    // Fetch user profile to get the role from the database
    let userRole = null;
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        userRole = profile?.role;
    }
    else {
        return redirect('/login');
    }



    // Authorization logic for Admin pages
    if (pathname.startsWith('/pages/admin')) {
        if (!userRole) return redirect('/login');

        //console.log(user)

        if (userRole !== 'admin') {
            return redirect('/unauthorized');
        }
    }

    // Authorization logic for Member pages
    if (pathname.startsWith('/pages/user')) {
        if (!userRole) return redirect('/login');

        if (userRole !== 'member' && userRole !== 'admin') {
            return redirect('/unauthorized');
        }
    }

    return response;
}

export const config = {
    matcher: ['/pages/admin/:path*', '/pages/members/:path*'],
}