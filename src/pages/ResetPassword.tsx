import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { KeyRound } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });

      // Redirecionar para a página de login após 2 segundos
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao redefinir senha",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/70 p-8 rounded-lg border border-gray-700 shadow-xl backdrop-blur-lg">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
            <KeyRound className="mr-2 h-6 w-6 text-netflix-red" />
            Redefinir Senha
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Nova Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-netflix-red hover:bg-red-700 transition-all duration-200 font-medium py-2"
                disabled={isLoading}
              >
                {isLoading ? "Atualizando..." : "Atualizar Senha"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 