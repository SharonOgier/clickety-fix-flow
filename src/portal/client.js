// Stub Supabase client for development
// This will be replaced when Lovable Cloud is enabled

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  import("@supabase/supabase-js").then(({ createClient }) => {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  });
}

// Export a proxy that won't crash when Supabase isn't configured
const supabaseProxy = new Proxy({}, {
  get(target, prop) {
    if (!supabase) {
      // Return a no-op chain for common Supabase methods
      const noOp = () => noOpProxy;
      const noOpProxy = new Proxy(noOp, {
        get: () => noOp,
        apply: () => noOpProxy,
      });
      if (prop === 'auth') {
        return {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: (cb) => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured. Enable Lovable Cloud to connect." } }),
          signUp: async () => ({ data: null, error: { message: "Supabase not configured. Enable Lovable Cloud to connect." } }),
          signOut: async () => ({ error: null }),
          resetPasswordForEmail: async () => ({ error: { message: "Supabase not configured." } }),
          updateUser: async () => ({ error: { message: "Supabase not configured." } }),
        };
      }
      return noOp;
    }
    return supabase[prop];
  }
});

export { supabaseProxy as supabase };
