
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";  // Updated import
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Lock } from "lucide-react";

// Modified schema to make email validation less strict
const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoginForm = ({ isLoading, setIsLoading }: LoginFormProps) => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state, or default to home
  const redirectPath = location.state?.from?.pathname || "/";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", data.email);
      await signIn(data.email, data.password);
      console.log("Login successful, navigating to:", redirectPath);
      
      // Clear any redirect flags
      sessionStorage.removeItem('auth_redirect_shown');
      
      // Delay navigation slightly to allow auth state to update
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
    } catch (error: any) {
      console.error("Authentication error:", error);
      if (error.message?.includes("Invalid login")) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Email ou senha incorretos"
        });
      } else if (error.message?.includes("Email not confirmed")) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Por favor, confirme seu email antes de fazer login"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: error.message || "Erro ao fazer login"
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Lock className="mr-2 h-6 w-6 text-netflix-red" />
        Entrar
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

          <Button
            type="submit"
            className="w-full bg-netflix-red hover:bg-red-700 transition-all duration-200 font-medium py-2 mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Entrar"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
