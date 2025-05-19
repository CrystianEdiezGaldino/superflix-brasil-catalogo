import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
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
import { Lock, Keyboard } from "lucide-react";
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
  onKeyboardStateChange: (show: boolean, focused: string | null) => void;
  emailRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  form: UseFormReturn<LoginFormData>;
}

const LoginForm = ({ 
  isLoading, 
  setIsLoading, 
  onKeyboardStateChange,
  emailRef,
  passwordRef,
  form
}: LoginFormProps) => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string | null>('email');
  const [isMobile, setIsMobile] = useState(false);
  
  const termsRef = useRef<HTMLButtonElement>(null);
  const forgotPasswordRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Get redirect path from location state, or default to home
  const redirectPath = location.state?.from?.pathname || "/";

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Efeito para focar no campo de email quando o componente for montado
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
      setFocusedElement('email');
      if (!isMobile) {
        onKeyboardStateChange(true, 'email');
      }
    }
  }, [isMobile, onKeyboardStateChange]);

  const handleKeyPress = (key: string) => {
    if (focusedElement === 'email') {
      const currentValue = form.getValues('email');
      form.setValue('email', currentValue + key, { shouldValidate: true });
    } else if (focusedElement === 'password') {
      const currentValue = form.getValues('password');
      form.setValue('password', currentValue + key, { shouldValidate: true });
    }
  };

  const handleEnter = () => {
    if (focusedElement === 'email') {
      const emailValue = form.getValues('email');
      if (emailValue) {
        passwordRef.current?.focus();
        setFocusedElement('password');
        onKeyboardStateChange(true, 'password');
      }
    } else if (focusedElement === 'password') {
      const passwordValue = form.getValues('password');
      if (passwordValue) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleBackspace = () => {
    if (focusedElement === 'email') {
      const currentValue = form.getValues('email');
      form.setValue('email', currentValue.slice(0, -1), { shouldValidate: true });
    } else if (focusedElement === 'password') {
      const currentValue = form.getValues('password');
      form.setValue('password', currentValue.slice(0, -1), { shouldValidate: true });
    }
  };

  const handleFocusChange = (element: string) => {
    setFocusedElement(element);
    if (!isMobile) {
      onKeyboardStateChange(true, element);
    }
  };

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
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Lock className="mr-2 h-6 w-6 text-netflix-red" />
          Entrar
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onKeyboardStateChange(!focusedElement, focusedElement)}
            className="text-gray-400 hover:text-white"
          >
            <Keyboard className="h-5 w-5" />
          </Button>
        )}
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
                    placeholder="Digite seu email"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                    onFocus={() => handleFocusChange('email')}
                    autoFocus
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
                    placeholder="Digite sua senha"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                    onFocus={() => handleFocusChange('password')}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

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
                    onFocus={() => handleFocusChange('terms')}
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
                    {" "}e{" "}
                    <Link 
                      to="/politica-de-privacidade" 
                      className="text-netflix-red hover:underline"
                      target="_blank"
                    >
                      política de privacidade
                    </Link>
                  </FormLabel>
                  <FormMessage className="text-red-400" />
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <button
              ref={forgotPasswordRef}
              type="button"
              onClick={() => setShowResetPassword(true)}
              className="text-sm text-netflix-red hover:text-red-400 hover:underline transition-colors"
              disabled={isLoading}
              onFocus={() => handleFocusChange('forgotPassword')}
            >
              Esqueceu a senha?
            </button>
          </div>

          <Button
            ref={submitRef}
            type="submit"
            className="w-full bg-netflix-red hover:bg-red-700 transition-all duration-200 font-medium py-2 mt-2"
            disabled={isLoading}
            onFocus={() => handleFocusChange('submit')}
          >
            {isLoading ? "Processando..." : "Entrar"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
