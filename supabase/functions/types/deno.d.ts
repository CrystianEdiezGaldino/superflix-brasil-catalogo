/// <reference lib="dom" />
/// <reference lib="esnext" />

declare namespace Deno {
  interface Env {
    get(key: string): string | undefined;
  }
  const env: Env;
}

declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export function serve(handler: (req: Request) => Promise<Response>): void;
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  interface SupabaseClient {
    from: (table: string) => {
      select: (columns?: string) => {
        eq: (column: string, value: any) => {
          single: () => Promise<{ data: any; error: any }>;
        };
      };
      insert: (data: any) => {
        select: () => {
          single: () => Promise<{ data: any; error: any }>;
        };
      };
      update: (data: any) => {
        eq: (column: string, value: any) => {
          select: () => {
            single: () => Promise<{ data: any; error: any }>;
          };
        };
      };
    };
    functions: {
      invoke: (name: string, options: { body: any }) => Promise<{ error: any }>;
    };
  }

  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: {
      auth?: {
        persistSession?: boolean;
        autoRefreshToken?: boolean;
        detectSessionInUrl?: boolean;
      };
    }
  ): SupabaseClient;
} 