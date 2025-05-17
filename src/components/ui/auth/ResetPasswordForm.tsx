import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
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
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onBack: () => void;
}

const ResetPasswordForm = ({ isLoading, setIsLoading, onBack }: ResetPasswordFormProps) => {
  const { resetPassword } = useAuth();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      form.reset();
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao enviar email de recuperação",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
        <KeyRound className="mr-2 h-6 w-6 text-netflix-red" />
        Recuperar Senha
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="seu.email@exemplo.com"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full bg-netflix-red hover:bg-red-700 transition-all duration-200 font-medium py-2"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Email de Recuperação"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="w-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
              disabled={isLoading}
            >
              Voltar para o Login
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ResetPasswordForm; 