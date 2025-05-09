
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreditCard, UserPlus, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  cpf: z.string().optional(),
  promoCode: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      cpf: "",
      promoCode: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success("Login realizado com sucesso");
      navigate("/");
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // Prepare user metadata including promoCode if provided
      const metadata: Record<string, string> = {};
      if (data.cpf) {
        metadata.cpf = data.cpf.replace(/\D/g, '');
      }
      if (data.promoCode) {
        metadata.promoCode = data.promoCode;
      }
      
      await signUp(data.email, data.password, metadata);
      toast.success("Cadastro realizado! Verifique seu email para confirmar.");
      // Switch to login form after successful signup
      setIsSignUp(false);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-digits
    value = value.replace(/\D/g, '');
    
    // Apply CPF mask as the user types (XXX.XXX.XXX-XX)
    if (value.length > 0) {
      value = value
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2}).*/, '$1.$2.$3-$4');
    }
    
    // Update the form field
    signupForm.setValue('cpf', value);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/60 p-8 rounded-lg border border-gray-700 shadow-lg backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
          {isSignUp ? (
            <>
              <UserPlus className="mr-2 h-6 w-6 text-netflix-red" />
              Criar conta
            </>
          ) : (
            <>
              <Lock className="mr-2 h-6 w-6 text-netflix-red" />
              Entrar
            </>
          )}
        </h1>

        {isSignUp ? (
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <FormField
                control={signupForm.control}
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
                control={signupForm.control}
                name="cpf"
                render={({ field: { onChange, onBlur, name, ref, ...restField } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">CPF (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000.000.000-00"
                        {...restField}
                        onChange={handleCPFChange}
                        onBlur={onBlur}
                        name={name}
                        ref={ref}
                        disabled={isLoading}
                        className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
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
              
              <FormField
                control={signupForm.control}
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
                {isLoading ? "Processando..." : "Cadastrar"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
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
                control={loginForm.control}
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
        )}

        <div className="mt-6 text-center border-t border-gray-700 pt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-netflix-red hover:text-red-400 hover:underline transition-colors"
            disabled={isLoading}
          >
            {isSignUp ? "Já tem conta? Entre" : "Não tem conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
