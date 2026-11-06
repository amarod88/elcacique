'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para el ojo
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setErrorMsg(error.message);
      else alert('Revisa tu correo para confirmar tu cuenta.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
      else router.push('/'); 
    }
    setLoading(false);
  };

  return (
    <div className="bg-beige min-h-screen flex items-center justify-center py-16">
      <Container>
        <div className="bg-blanco p-8 md:p-12 rounded-2xl shadow-lg border border-azul/10 max-w-md mx-auto text-center">
          <h1 className="font-display text-3xl text-azul mb-2">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h1>
          <p className="text-marron-400 text-sm mb-8">
            {isSignUp ? 'Únete a El Cacique para gestionar tus pedidos.' : 'Bienvenido de vuelta a El Cacique.'}
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <button onClick={() => handleOAuth('google')} className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors text-azul font-medium">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continuar con Google
            </button>
            <button onClick={() => handleOAuth('facebook')} className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors text-azul font-medium">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
              Continuar con Facebook
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1 border-beige-200" />
            <span className="text-xs text-marron-400">O usa tu correo</span>
            <hr className="flex-1 border-beige-200" />
          </div>

          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-sm font-semibold text-azul block mb-1">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-beige-200 focus:outline-none focus:border-azul text-marron" />
            </div>
            <div>
              <label className="text-sm font-semibold text-azul block mb-1">Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-lg border border-beige-200 focus:outline-none focus:border-azul text-marron pr-12" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-marron-400 hover:text-azul transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Ingresar'}
            </Button>
          </form>

          <div className="mt-6 text-sm text-marron-400">
            {isSignUp ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-azul font-semibold hover:underline">
              {isSignUp ? 'Inicia sesión' : 'Regístrate aquí'}
            </button>
          </div>
          
          <div className="mt-4 text-xs">
             <Link href="/recuperar-password" className="text-marron-400 hover:text-azul">¿Olvidaste tu contraseña?</Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
