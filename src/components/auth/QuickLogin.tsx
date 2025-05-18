
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface QuickLoginProps {
  onLogin: (session: any) => void;
}

export const QuickLogin = ({ onLogin }: QuickLoginProps) => {
  const [code, setCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [validationAttempts, setValidationAttempts] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [generationAttempts, setGenerationAttempts] = useState(0);
  const MAX_VALIDATION_ATTEMPTS = 12; // 2 minutes (12 * 10 seconds)
  const MAX_GENERATION_ATTEMPTS = 3; // Max generation attempts

  // Get device info and generate code on mount
  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
    setDeviceInfo(info);
    
    // Delay the code generation slightly to ensure the component is fully mounted
    const timer = setTimeout(() => {
      generateCode(info);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Generate a new code
  const generateCode = async (info: any) => {
    if (!info || generationAttempts >= MAX_GENERATION_ATTEMPTS) {
      setIsExpired(true);
      return;
    }
    
    setIsGenerating(true);
    setValidationAttempts(0);
    setIsExpired(false);
    try {
      // Add error handling with retry
      let retries = 0;
      const maxRetries = 3;
      let success = false;
      let responseData = null;
      
      while (retries < maxRetries && !success) {
        try {
          const response = await supabase.functions.invoke('quick-login', {
            body: {
              action: 'generate',
              deviceInfo: info
            }
          });
          
          if (response.error) throw response.error;
          responseData = response.data;
          success = true;
        } catch (err) {
          console.error(`Attempt ${retries + 1} failed:`, err);
          retries++;
          // Wait a bit before retrying
          if (retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      if (!success || !responseData?.code) {
        throw new Error('Failed to generate code after multiple attempts');
      }

      setCode(responseData.code);
      setTimeLeft(300); // Reset timer
      setGenerationAttempts(0); // Reset generation attempts on success
    } catch (error: any) {
      console.error("Error generating code:", error);
      toast.error(error.message || "Erro ao gerar código");
      setGenerationAttempts(prev => prev + 1);
      
      if (generationAttempts + 1 >= MAX_GENERATION_ATTEMPTS) {
        setIsExpired(true);
        toast.error("Número máximo de tentativas de geração atingido");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Check code status
  const checkCode = async () => {
    if (!code || validationAttempts >= MAX_VALIDATION_ATTEMPTS) return;
    
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('quick-login', {
        body: {
          action: 'check',
          code
        }
      });

      if (error) {
        console.error("Error checking code:", error);
        throw error;
      }
      
      if (data.status === 'validated') {
        // Set the session
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });

          if (sessionError) throw sessionError;
          
          onLogin(data.session);
          toast.success("Login realizado com sucesso!");
        } catch (sessionError: any) {
          console.error("Error setting session:", sessionError);
          toast.error("Erro ao configurar sessão: " + sessionError.message);
        }
      } else if (data.status === 'expired') {
        setCode("");
        setIsExpired(true);
        toast.error("Código expirado");
      } else if (data.status === 'invalid') {
        setCode("");
        toast.error("Código inválido");
      }
    } catch (error: any) {
      console.error("Error in checkCode:", error);
    } finally {
      setIsChecking(false);
      setValidationAttempts(prev => prev + 1);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!code || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCode("");
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [code, timeLeft]);

  // Poll for code validation
  useEffect(() => {
    if (!code || timeLeft <= 0 || validationAttempts >= MAX_VALIDATION_ATTEMPTS) return;

    // Check immediately when code is generated
    checkCode();

    // Then check every 10 seconds
    const pollInterval = setInterval(checkCode, 10000);

    return () => clearInterval(pollInterval);
  }, [code, timeLeft, validationAttempts]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Card className="bg-black/75 border-gray-800 p-8">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Login Rápido</h2>
          <p className="text-gray-400">
            Use seu dispositivo já logado para validar o acesso
          </p>
        </div>

        {isExpired ? (
          <div className="text-center space-y-4">
            <p className="text-red-500 font-medium">
              {generationAttempts >= MAX_GENERATION_ATTEMPTS 
                ? "Número máximo de tentativas de geração atingido"
                : "O código expirou ou atingiu o limite de tentativas"}
            </p>
            <p className="text-gray-400">
              Por favor, atualize a página para tentar novamente
            </p>
            <Button
              onClick={handleRefresh}
              className="w-full bg-netflix-red hover:bg-red-700"
            >
              Atualizar Página
            </Button>
          </div>
        ) : !code ? (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {isGenerating ? "Gerando código..." : "Aguarde, gerando código..."}
            </p>
            {generationAttempts > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Tentativas de geração: {generationAttempts}/{MAX_GENERATION_ATTEMPTS}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-white mb-2 tracking-wider">
                {code}
              </div>
              <div className="text-sm text-gray-400">
                Expira em {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
              <Progress value={(timeLeft / 300) * 100} className="mt-2" />
              {validationAttempts > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Tentativas de validação: {validationAttempts}/{MAX_VALIDATION_ATTEMPTS}
                </p>
              )}
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>1. Abra o app em outro dispositivo</p>
              <p>2. Vá em Perfil {">"} Validar Acesso Rápido</p>
              <p>3. Digite o código acima</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
