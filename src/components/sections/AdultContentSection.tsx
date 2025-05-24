
import React, { useState } from 'react';
import { MediaItem } from '@/types/movie';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface AdultContentSectionProps {
  adultContent: MediaItem[];
  onMediaClick: (media: MediaItem) => void;
}

const AdultContentSection: React.FC<AdultContentSectionProps> = ({ adultContent, onMediaClick }) => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!adultContent || adultContent.length === 0) return null;

  const handleUnlock = async () => {
    setIsLoading(true);
    
    try {
      // Simulando verificação de senha - em um app real, você faria uma verificação correta
      // Aqui estamos apenas aceitando alguns valores para demonstração
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (password === 'admin123' || password === 'senha123' || password === 'password') {
        setIsBlurred(false);
        setIsPasswordDialogOpen(false);
        toast({
          title: "Conteúdo adulto desbloqueado",
          description: "Você agora tem acesso ao conteúdo adulto.",
          variant: "default"
        });
      } else {
        setAttempts(prev => prev + 1);
        toast({
          title: "Senha incorreta",
          description: "Por favor, tente novamente com a senha correta.",
          variant: "destructive"
        });
        
        if (attempts >= 2) {
          toast({
            title: "Muitas tentativas",
            description: "Você excedeu o número máximo de tentativas.",
            variant: "destructive"
          });
          setIsPasswordDialogOpen(false);
        }
      }
    } catch (error) {
      toast({
        title: "Erro ao verificar senha",
        description: "Ocorreu um erro ao verificar sua senha. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          Conteúdo Adulto
          {isBlurred ? (
            <EyeOff className="h-5 w-5 text-red-500" />
          ) : (
            <Eye className="h-5 w-5 text-green-500" />
          )}
        </h2>
        
        <Button
          onClick={() => setIsPasswordDialogOpen(true)} 
          variant="outline" 
          size="sm"
          className="text-sm"
        >
          {isBlurred ? "Desbloquear conteúdo" : "Bloquear conteúdo"}
        </Button>
      </div>
      
      {isBlurred ? (
        <Alert variant="destructive" className="mb-4 bg-red-900/20 text-red-300 border-red-700">
          <AlertDescription className="flex flex-col gap-2 items-start">
            <p>Este conteúdo é exclusivo para adultos e está bloqueado.</p>
            <Button 
              onClick={() => setIsPasswordDialogOpen(true)}
              variant="outline" 
              size="sm" 
              className="border-red-600 hover:bg-red-900/50 text-white"
            >
              Desbloquear com senha
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex space-x-4 pb-4">
            {adultContent.map((item) => (
              <div 
                key={item.id}
                className="w-40 md:w-48 flex-none relative group cursor-pointer"
                onClick={() => onMediaClick(item)}
              >
                <div className="relative overflow-hidden rounded-md">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}`}
                    alt={item.title || item.name || ''}
                    className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                    <span className="inline-block bg-red-700 text-white text-xs px-1 rounded">+18</span>
                  </div>
                </div>
                
                <div className="mt-1">
                  <h3 className="text-white text-sm font-medium truncate">
                    {item.title || item.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verificação de idade</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-400 mb-4">
              Este conteúdo é restrito para maiores de 18 anos. Por favor, digite sua senha para confirmar sua identidade.
            </p>
            
            <Input 
              type="password" 
              placeholder="Digite sua senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {attempts > 0 && (
              <p className="text-xs text-red-500 mt-1">
                Senha incorreta. Tentativas restantes: {3 - attempts}
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUnlock}
              disabled={!password || isLoading}
            >
              {isLoading ? "Verificando..." : "Desbloquear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdultContentSection;
