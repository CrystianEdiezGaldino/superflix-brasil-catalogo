import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Lock } from "lucide-react";
import ResetPasswordForm from "./ResetPasswordForm";

// Modified schema to include terms acceptance
const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos para continuar"
  })
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
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLButtonElement>(null);
  const forgotPasswordRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Get redirect path from location state, or default to home
  const redirectPath = location.state?.from?.pathname || "/";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      termsAccepted: true
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!data.termsAccepted) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa aceitar os termos para continuar"
      });
      return;
    }

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

  // Navegação por Tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        
        switch (focusedElement) {
          case 'email':
            if (e.shiftKey) {
              // Não faz nada, já está no primeiro elemento
            } else {
              setFocusedElement('password');
              passwordRef.current?.focus();
            }
            break;
            
          case 'password':
            if (e.shiftKey) {
              setFocusedElement('email');
              emailRef.current?.focus();
            } else {
              setFocusedElement('terms');
              termsRef.current?.focus();
            }
            break;
            
          case 'terms':
            if (e.shiftKey) {
              setFocusedElement('password');
              passwordRef.current?.focus();
            } else {
              setFocusedElement('forgotPassword');
              forgotPasswordRef.current?.focus();
            }
            break;
            
          case 'forgotPassword':
            if (e.shiftKey) {
              setFocusedElement('terms');
              termsRef.current?.focus();
            } else {
              setFocusedElement('submit');
              submitRef.current?.focus();
            }
            break;
            
          case 'submit':
            if (e.shiftKey) {
              setFocusedElement('forgotPassword');
              forgotPasswordRef.current?.focus();
            }
            // Não faz nada se for para frente, já está no último elemento
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedElement]);

  if (showResetPassword) {
    return (
      <ResetPasswordForm
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onBack={() => setShowResetPassword(false)}
      />
    );
  }

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
                    ref={emailRef}
                    placeholder="seu.email@exemplo.com"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                    onFocus={() => setFocusedElement('email')}
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
                    ref={passwordRef}
                    type="password"
                    placeholder="******"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                    onFocus={() => setFocusedElement('password')}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      ref={termsRef}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      className="border-gray-600 data-[state=checked]:bg-netflix-red data-[state=checked]:border-netflix-red"
                      onFocus={() => setFocusedElement('terms')}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-300">
                      Li e aceito os{" "}
                      <Link 
                        to="/termos-de-servico" 
                        className="text-netflix-red hover:underline"
                        target="_blank"
                      >
                        termos de serviço
                      </Link>
                    </FormLabel>
                    <FormMessage className="text-red-400" />
                  </div>
                </FormItem>
              )}
            />

            <button
              ref={forgotPasswordRef}
              type="button"
              onClick={() => setShowResetPassword(true)}
              className="text-sm text-netflix-red hover:text-red-400 hover:underline transition-colors"
              disabled={isLoading}
              onFocus={() => setFocusedElement('forgotPassword')}
            >
              Esqueceu a senha?
            </button>
          </div>

          <Button
            ref={submitRef}
            type="submit"
            className="w-full bg-netflix-red hover:bg-red-700 transition-all duration-200 font-medium py-2 mt-2"
            disabled={isLoading}
            onFocus={() => setFocusedElement('submit')}
          >
            {isLoading ? "Processando..." : "Entrar"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
