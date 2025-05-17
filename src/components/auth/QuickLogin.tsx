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
  const [autoGenerateTimeLeft, setAutoGenerateTimeLeft] = useState(20);

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
    generateCode(info);
  }, []);

  // Generate a new code
  const generateCode = async (info: any) => {
    if (!info) return;
    
    setIsGenerating(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL não configurada');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/quick-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'generate',
          deviceInfo: info
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate code');
      }

      const data = await response.json();
      setCode(data.code);
      setTimeLeft(300); // Reset timer
    } catch (error: any) {
      toast.error(error.message || "Erro ao gerar código");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Check code status
  const checkCode = async () => {
    if (!code) return;
    
    setIsChecking(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL não configurada');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/quick-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          action: 'check',
          code
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check code');
      }

      const data = await response.json();
      
      if (data.status === 'validated') {
        // Set the session
        const { error } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });

        if (error) throw error;
        
        onLogin(data.session);
        toast.success("Login realizado com sucesso!");
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsChecking(false);
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
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [code, timeLeft]);

  // Poll for code validation
  useEffect(() => {
    if (!code || timeLeft <= 0) return;

    const pollInterval = setInterval(checkCode, 2000);
    return () => clearInterval(pollInterval);
  }, [code, timeLeft]);

  return (
    <Card className="bg-black/75 border-gray-800 p-8">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Login Rápido</h2>
          <p className="text-gray-400">
            Use seu dispositivo já logado para validar o acesso
          </p>
        </div>

        {!code ? (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {isGenerating ? "Gerando código..." : "Aguarde, gerando código..."}
            </p>
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
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>1. Abra o app em outro dispositivo</p>
              <p>2. Vá em Perfil {">"} Validar Acesso Rápido</p>
              <p>3. Digite o código acima</p>
            </div>

            <Button
              onClick={() => generateCode(deviceInfo)}
              variant="outline"
              className="w-full"
            >
              Gerar novo código
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}; 