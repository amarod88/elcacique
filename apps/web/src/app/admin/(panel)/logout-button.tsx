"use client";
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };
  return (
    <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 font-medium">
      Cerrar Sesión
    </button>
  );
}
