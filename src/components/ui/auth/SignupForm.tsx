
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";  // Use only sonner toast
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserPlus, CreditCard } from "lucide-react";

// Modified schema to remove email validation
const signupSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  promoCode: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSuccess: () => void;
}

const SignupForm = ({ isLoading, setIsLoading, onSuccess }: SignupFormProps) => {
  const { signUp } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      promoCode: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      console.log("Attempting signup with:", data.email);
      // Prepare user metadata including promoCode if provided
      const metadata: Record<string, string> = {};
      if (data.promoCode) {
        metadata.promoCode = data.promoCode;
      }
      
      await signUp(data.email, data.password, metadata);
      
      toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
      
      // Limpar o formulário após o cadastro bem-sucedido
      form.reset();
      
      // Switch to login form after successful signup
      onSuccess();
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Check for specific error messages
      if (error.message?.includes("already") || error.message?.includes("já existe")) {
        toast.error("Este email já está sendo usado.");
      } else {
        toast.error(error.message || "Erro ao criar conta");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
        <UserPlus className="mr-2 h-6 w-6 text-netflix-red" />
        Criar conta
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
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Senha</FormLabel>
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
            name="promoCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">
                  <div className="flex items-center">
                    <CreditCard className="mr-1 h-4 w-4 text-netflix-red" />
                    <span>Código Promocional (opcional)</span>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insira seu código promocional"
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
            className="w-full bg-netflix-red hover:bg-red-700 transition-all duration-200 font-medium py-2 mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Cadastrar"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignupForm;
