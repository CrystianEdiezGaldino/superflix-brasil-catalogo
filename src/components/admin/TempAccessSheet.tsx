
import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserWithSubscription } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

interface TempAccessSheetProps {
  user: UserWithSubscription;
  onSuccess: () => void;
}

const TempAccessSheet = ({ user, onSuccess }: TempAccessSheetProps) => {
  const [tempAccessDays, setTempAccessDays] = useState(30);
  const [isGranting, setIsGranting] = useState(false);

  const grantTempAccess = async () => {
    setIsGranting(true);
    try {
      const { data, error } = await supabase.functions.invoke('grant-temp-access', {
        body: {
          userId: user.id,
          days: tempAccessDays
        }
      });
      
      if (error) throw error;
      
      toast.success(`Acesso temporário concedido por ${tempAccessDays} dias`);
      onSuccess();
    } catch (error) {
      console.error('Error granting temp access:', error);
      toast.error('Erro ao conceder acesso temporário');
    } finally {
      setIsGranting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
        >
          Conceder Acesso
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-900 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Conceder Acesso Temporário</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-4">
          <div>
            <p className="mb-2">Usuário:</p>
            <p className="font-bold">{user.email}</p>
          </div>
          <div>
            <p className="mb-2">Dias de acesso:</p>
            <Input
              type="number"
              value={tempAccessDays}
              onChange={(e) => setTempAccessDays(Number(e.target.value))}
              min="1"
              max="365"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <Button 
            className="w-full mt-4" 
            onClick={grantTempAccess}
            disabled={isGranting}
          >
            {isGranting ? "Processando..." : "Conceder Acesso"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TempAccessSheet;
