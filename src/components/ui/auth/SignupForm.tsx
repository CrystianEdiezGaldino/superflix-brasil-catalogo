
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess: () => void;
}

const SignupForm = ({ isLoading, setIsLoading, onSuccess }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Conta criada com sucesso! Verifique seu e-mail.");
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast.error(error.message || "Falha ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Criar Conta</h1>
        <p className="text-gray-400">Junte-se a milhares de assinantes</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-netflix-red hover:bg-red-700"
      >
        {isLoading ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  );
};

export default SignupForm;
