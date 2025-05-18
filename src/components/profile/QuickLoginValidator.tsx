import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const QuickLoginValidator = () => {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { session } = useAuth();

  const validateCode = async () => {
    if (!code) {
      toast.error("Por favor, digite o código");
      return;
    }

    if (!session) {
      toast.error("Você precisa estar logado para validar um código");
      return;
    }

    setIsValidating(true);
    try {
      console.log("Attempting to validate code:", code);
      console.log("Using session token:", session.access_token);
      
      const { data, error } = await supabase.functions.invoke('quick-login', {
        body: {
          action: 'validate',
          code
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        console.error("Error validating code:", error);
        throw new Error(error.message || "Erro de comunicação com o servidor");
      }
      
      if (!data?.success) {
        console.error("Validation response without success:", data);
        throw new Error('Falha ao validar código');
      }

      toast.success("Dispositivo validado com sucesso!");
      setCode("");
    } catch (error: any) {
      console.error("Error in validateCode:", error);
      toast.error(error.message || "Erro ao validar código");
    } finally {
      setIsValidating(false);
    }
  };

  // Format code to be more readable: XX-XXXX
  const formatCode = (input: string): string => {
    const cleaned = input.replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Strip all non-alphanumeric characters for internal storage
    const cleanValue = value.replace(/[^A-Z0-9]/g, '');
    setCode(cleanValue);
  };

  const displayCode = formatCode(code);

  return (
    <Card className="bg-black/75 border-gray-800 p-8">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Validar Acesso Rápido</h2>
          <p className="text-gray-400">
            Digite o código exibido no outro dispositivo
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code" className="text-gray-300">Código</Label>
          <Input
            id="code"
            type="text"
            placeholder="Digite o código"
            value={displayCode}
            onChange={handleCodeChange}
            disabled={isValidating}
            className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red text-center text-lg tracking-wider"
            maxLength={7} // 6 chars plus 1 hyphen
          />
        </div>

        <Button
          onClick={validateCode}
          disabled={isValidating || code.length < 6}
          className="w-full bg-netflix-red hover:bg-red-700"
        >
          {isValidating ? "Validando..." : "Validar Código"}
        </Button>
      </div>
    </Card>
  );
};
