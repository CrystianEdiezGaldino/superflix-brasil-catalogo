import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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
import { UserPlus, CreditCard } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Modified schema to include all fields
const signupSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Email é obrigatório"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos para continuar"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSuccess?: () => void;
}

const SignupForm = ({ isLoading, setIsLoading, onSuccess }: SignupFormProps) => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    if (!data.termsAccepted) {
      toast.error("Você precisa aceitar os termos para continuar");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.name);
      toast.success("Conta criada com sucesso!");
      
      // Switch to login form after successful signup
      onSuccess?.();
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.message?.includes("Email already in use")) {
        toast.error("Este email já está em uso");
      } else if (error.message?.includes("Invalid email")) {
        toast.error("Email inválido");
      } else {
        toast.error(error.message || "Erro ao criar conta");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Navegação por Tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        
        switch (focusedElement) {
          case 'name':
            if (e.shiftKey) {
              // Não faz nada, já está no primeiro elemento
            } else {
              setFocusedElement('email');
              emailRef.current?.focus();
            }
            break;
            
          case 'email':
            if (e.shiftKey) {
              setFocusedElement('name');
              nameRef.current?.focus();
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
              setFocusedElement('confirmPassword');
              confirmPasswordRef.current?.focus();
            }
            break;
            
          case 'confirmPassword':
            if (e.shiftKey) {
              setFocusedElement('password');
              passwordRef.current?.focus();
            } else {
              setFocusedElement('terms');
              termsRef.current?.focus();
            }
            break;
            
          case 'terms':
            if (e.shiftKey) {
              setFocusedElement('confirmPassword');
              confirmPasswordRef.current?.focus();
            } else {
              setFocusedElement('submit');
              submitRef.current?.focus();
            }
            break;
            
          case 'submit':
            if (e.shiftKey) {
              setFocusedElement('terms');
              termsRef.current?.focus();
            }
            // Não faz nada se for para frente, já está no último elemento
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedElement]);

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
        <UserPlus className="mr-2 h-6 w-6 text-netflix-red" />
        Criar Conta
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Nome</FormLabel>
                <FormControl>
                  <Input
                    ref={nameRef}
                    placeholder="Seu nome completo"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                    onFocus={() => setFocusedElement('name')}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Confirmar Senha</FormLabel>
                <FormControl>
                  <Input
                    ref={confirmPasswordRef}
                    type="password"
                    placeholder="******"
                    {...field}
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
                    onFocus={() => setFocusedElement('confirmPassword')}
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

          <Button
            ref={submitRef}
            type="submit"
            className="w-full bg-netflix-red hover:bg-red-700 transition-all duration-200 font-medium py-2 mt-2"
            disabled={isLoading}
            onFocus={() => setFocusedElement('submit')}
          >
            {isLoading ? "Processando..." : "Criar Conta"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignupForm;
