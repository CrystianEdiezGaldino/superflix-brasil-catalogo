
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const QuickLoginValidator = () => {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const validateCode = async () => {
    if (!code) {
      toast.error("Por favor, digite o código");
      return;
    }

    setIsValidating(true);
    try {
      // Use the Supabase client's invoke method to call the edge function
      const { data, error } = await supabase.functions.invoke('quick-login', {
        body: {
          action: 'validate',
          code
        }
      });

      if (error) {
        console.error("Error validating code:", error);
        throw error;
      }
      
      if (!data?.success) {
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
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={isValidating}
            className="bg-gray-800 border-gray-600 text-white focus:ring-netflix-red focus:border-netflix-red"
            maxLength={6}
          />
        </div>

        <Button
          onClick={validateCode}
          disabled={isValidating}
          className="w-full bg-netflix-red hover:bg-red-700"
        >
          {isValidating ? "Validando..." : "Validar Código"}
        </Button>
      </div>
    </Card>
  );
};
