import { useState, useEffect, useRef } from "react";
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
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

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

  // Navegação por Tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        
        switch (focusedElement) {
          case 'email':
            if (e.shiftKey) {
              setFocusedElement('back');
              backRef.current?.focus();
            } else {
              setFocusedElement('submit');
              submitRef.current?.focus();
            }
            break;
            
          case 'back':
            if (e.shiftKey) {
              // Não faz nada, já está no primeiro elemento
            } else {
              setFocusedElement('email');
              emailRef.current?.focus();
            }
            break;
            
          case 'submit':
            if (e.shiftKey) {
              setFocusedElement('email');
              emailRef.current?.focus();
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
        <KeyRound className="mr-2 h-6 w-6 text-netflix-red" />
        Redefinir Senha
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

          <div className="flex gap-4">
            <Button
              ref={backRef}
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 border-gray-600 text-white hover:bg-gray-700"
              disabled={isLoading}
              onFocus={() => setFocusedElement('back')}
            >
              Voltar
            </Button>

            <Button
              ref={submitRef}
              type="submit"
              className="flex-1 bg-netflix-red hover:bg-red-700"
              disabled={isLoading}
              onFocus={() => setFocusedElement('submit')}
            >
              {isLoading ? "Processando..." : "Enviar"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ResetPasswordForm; 