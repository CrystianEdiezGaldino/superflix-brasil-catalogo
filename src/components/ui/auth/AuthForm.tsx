import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import AuthFormToggle from "./AuthFormToggle";
import VirtualKeyboard from "./VirtualKeyboard";

// Modified schema to include terms acceptance
const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos para continuar"
  })
});

type LoginFormData = z.infer<typeof loginSchema>;

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [focusedElement, setFocusedElement] = useState<string | null>('email');
  const [isMobile, setIsMobile] = useState(false);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Verificar se é dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      termsAccepted: true
    }
  });

  const handleKeyboardStateChange = (show: boolean, focused: string | null) => {
    if (!isMobile) {
      setShowKeyboard(show);
      setFocusedElement(focused);
    }
  };

  const handleKeyPress = (key: string) => {
    if (focusedElement === 'email') {
      const currentValue = form.getValues('email');
      form.setValue('email', currentValue + key, { shouldValidate: true });
    } else if (focusedElement === 'password') {
      const currentValue = form.getValues('password');
      form.setValue('password', currentValue + key, { shouldValidate: true });
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

  const handleEnter = () => {
    if (focusedElement === 'email') {
      const emailValue = form.getValues('email');
      if (emailValue) {
        passwordRef.current?.focus();
        setFocusedElement('password');
        handleKeyboardStateChange(true, 'password');
      }
    } else if (focusedElement === 'password') {
      const passwordValue = form.getValues('password');
      if (passwordValue) {
        // Simula o clique no botão de submit
        const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
          submitButton.click();
        }
      }
    }
  };

  const handleCloseKeyboard = () => {
    setShowKeyboard(false);
    setFocusedElement(null);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gray-900/95 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {isSignUp ? (
            <SignupForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onSuccess={() => setIsSignUp(false)}
            />
          ) : (
            <LoginForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onKeyboardStateChange={handleKeyboardStateChange}
              emailRef={emailRef}
              passwordRef={passwordRef}
              form={form}
            />
          )}
        </AnimatePresence>

        <AuthFormToggle
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
          isLoading={isLoading}
        />
      </motion.div>

      <AnimatePresence>
        {showKeyboard && !isMobile && (
          <VirtualKeyboard
            onKeyPress={handleKeyPress}
            onEnter={handleEnter}
            onBackspace={handleBackspace}
            onClose={handleCloseKeyboard}
            currentInput={focusedElement === 'email' ? 'email' : focusedElement === 'password' ? 'password' : null}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;
