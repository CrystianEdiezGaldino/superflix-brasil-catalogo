import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { QuickLoginValidator } from "./QuickLoginValidator";

interface ProfileTabProps {
  user: User | null;
  profile: { username: string } | null;
  handleLogout: () => Promise<void>;
}

export const ProfileTab = ({ user, profile, handleLogout }: ProfileTabProps) => {
  const [showQuickLoginValidator, setShowQuickLoginValidator] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white">Informações da Conta</h3>
              <p className="text-sm text-gray-400">Gerencie suas informações pessoais</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-800 border-gray-600 text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nome de Usuário</label>
              <Input
                type="text"
                value={profile?.username || ""}
                disabled
                className="bg-gray-800 border-gray-600 text-gray-400"
              />
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => setShowQuickLoginValidator(true)}
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Validar Acesso Rápido
              </Button>
            </div>

            <div className="pt-4">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full"
              >
                Sair da Conta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showQuickLoginValidator && (
        <QuickLoginValidator />
      )}
    </div>
  );
};
