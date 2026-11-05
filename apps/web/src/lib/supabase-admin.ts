import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fix D-011: Fallo ruidoso si faltan variables. Nunca silenciar un error de config.
if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    '🚨 FATAL: Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor. ' +
    'El backend no puede iniciar sin estas credenciales.'
  );
}

// Cliente exclusivo para Server Actions (Bypassea RLS porque usa service_role).
// ⚠️ NUNCA importar este archivo en un Client Component.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
