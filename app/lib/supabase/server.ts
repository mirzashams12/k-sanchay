import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    // Guard: Ensure variables exist before creating client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        // During build, this might trigger. Returning a dummy or throwing 
        // a clean error helps Next.js handle the failure gracefully.
        throw new Error("Missing Supabase Environment Variables");
    }

    return createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            async get(name) { return (await cookieStore).get(name)?.value },
            async set(name, value, options) {
                try { (await cookieStore).set({ name, value, ...options }) }
                catch (error) { /* Handle edge cases where cookies can't be set */ }
            },
            async remove(name, options) {
                try { (await cookieStore).set({ name, value: '', ...options }) }
                catch (error) { /* Handle edge cases */ }
            },
        },
    })
}