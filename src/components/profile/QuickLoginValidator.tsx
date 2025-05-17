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
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quick-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'validate',
          code
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to validate code');
      }

      toast.success("Dispositivo validado com sucesso!");
      setCode("");
    } catch (error: any) {
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