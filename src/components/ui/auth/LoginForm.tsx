
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
import { Lock, Keyboard } from "lucide-react";
import ResetPasswordForm from "./ResetPasswordForm";
import VirtualKeyboard from "./VirtualKeyboard";
import { AnimatePresence, motion } from "framer-motion";

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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);
  const [currentField, setCurrentField] = useState('email');
  
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

  // Efeito para focar no campo de email quando o componente for montado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (emailRef.current) {
        emailRef.current.focus();
        setFocusedElement('email');
        setCurrentField('email');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Função para inserir caracteres digitados no campo atual
  const handleKeyPress = (key: string) => {
    const currentInput = currentField === 'email' ? emailRef.current : passwordRef.current;
    if (!currentInput) return;

    const start = currentInput.selectionStart || 0;
    const end = currentInput.selectionEnd || 0;
    
    // Obter o valor atual do campo
    const fieldName = currentField === 'email' ? 'email' : 'password';
    const currentValue = form.getValues(fieldName);
    
    // Inserir o caractere na posição atual do cursor
    const newValue = currentValue.substring(0, start) + key + currentValue.substring(end);
    
    // Atualizar o valor no formulário
    form.setValue(fieldName, newValue, { shouldValidate: true });
    
    // Reposicionar o cursor após o caractere inserido
    setTimeout(() => {
      if (currentInput) {
        const newPosition = start + 1;
        currentInput.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Função para apagar caracteres
  const handleBackspace = () => {
    const currentInput = currentField === 'email' ? emailRef.current : passwordRef.current;
    if (!currentInput) return;

    const start = currentInput.selectionStart || 0;
    const end = currentInput.selectionEnd || 0;
    
    const fieldName = currentField === 'email' ? 'email' : 'password';
    const currentValue = form.getValues(fieldName);
    
    let newValue;
    if (start === end && start > 0) {
      // Se não há seleção, apaga o caractere anterior
      newValue = currentValue.substring(0, start - 1) + currentValue.substring(start);
    } else if (start !== end) {
      // Se há uma seleção, apaga a seleção
      newValue = currentValue.substring(0, start) + currentValue.substring(end);
    } else {
      return; // Se estiver no início do campo, não faz nada
    }
    
    form.setValue(fieldName, newValue, { shouldValidate: true });
    
    // Reposicionar o cursor
    setTimeout(() => {
      if (currentInput) {
        const newPosition = start === end ? Math.max(0, start - 1) : start;
        currentInput.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Função para lidar com a tecla Enter
  const handleEnter = () => {
    if (currentField === 'email') {
      // Muda para o campo de senha
      setCurrentField('password');
      setFocusedElement('password');
      passwordRef.current?.focus();
    } else if (currentField === 'password') {
      // Tenta submeter o formulário
      handleSubmitForm();
    }
  };

  // Função para tentar submeter o formulário
  const handleSubmitForm = () => {
    form.handleSubmit(onSubmit)();
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

  // Gerenciamento de foco nos campos
  const handleInputFocus = (field: string) => {
    setFocusedElement(field);
    setCurrentField(field);
    setIsKeyboardOpen(true);
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
    <div className="relative">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
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
                        placeholder="Digite seu email"
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                        onFocus={() => handleInputFocus('email')}
                        onClick={() => handleInputFocus('email')}
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
                        onFocus={() => handleInputFocus('password')}
                        onClick={() => handleInputFocus('password')}
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
        </motion.div>
      </AnimatePresence>

      {/* Teclado Virtual */}
      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        onEnter={handleEnter}
        onBackspace={handleBackspace}
        isOpen={isKeyboardOpen}
        onToggle={() => setIsKeyboardOpen(!isKeyboardOpen)}
        currentField={currentField}
      />
    </div>
  );
};

export default LoginForm;
