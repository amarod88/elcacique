import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from './logout-button';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: profile, error } = await supabase.from('profiles').select('role, email').eq('id', user.id).single();
  
  // DEBUG VISUAL EN PANTALLA
  if (profile?.role !== 'admin') {
    return (
      <div className="p-10 bg-red-100 text-red-900 min-h-screen font-mono text-sm">
        <h1 className="text-2xl font-bold mb-4">DEBUG: Acceso Denegado</h1>
        <p><strong>Auth User ID:</strong> {user?.id}</p>
        <p><strong>Auth Email:</strong> {user?.email}</p>
        <p><strong>Profile Data:</strong> {JSON.stringify(profile)}</p>
        <p><strong>Error:</strong> {JSON.stringify(error)}</p>
        <p className="mt-8"><a href="/admin/login" className="underline text-blue-600">Volver al Login</a></p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-amber-400">EL CACIQUE Admin</h2>
          <nav className="space-y-4">
            <a href="/admin/dashboard" className="block hover:text-amber-400 transition">Dashboard</a>
            <a href="/admin/inventario" className="block hover:text-amber-400 transition">Inventario</a>
          </nav>
        </div>
        <div className="border-t border-slate-700 pt-4">
          <p className="text-xs text-slate-400 mb-2">{profile.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
