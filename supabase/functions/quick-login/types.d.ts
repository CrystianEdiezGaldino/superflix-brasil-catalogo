declare module "https://esm.sh/@supabase/supabase-js@2.38.4" {
  import { GoTrueAdminApi } from "@supabase/supabase-js";
  
  export * from "@supabase/supabase-js";
  
  export interface ExtendedGoTrueAdminApi extends GoTrueAdminApi {
    createSession(params: { user_id: string; refresh_token: string | null }): Promise<{
      data: { user: any; session: any } | null;
      error: Error | null;
    }>;
  }
}

declare module "https://esm.sh/nanoid@4.0.2" {
  export function nanoid(size?: number): string;
}

declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Promise<Response>): void;
} 