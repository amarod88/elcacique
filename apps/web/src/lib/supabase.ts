import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fix D-011: Fallo ruidoso. Si falta una variable, el frontend NO debe colapsar silenciosamente.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '🚨 FATAL: Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en el entorno. ' +
    'El frontend no puede iniciar sin estas credenciales.'
  );
}

// Cliente público (usa anon key). Sujeto a RLS.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
