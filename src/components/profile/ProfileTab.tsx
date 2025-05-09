
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface ProfileTabProps {
  user: User | null;
  profile: { username: string } | null;
  handleLogout: () => Promise<void>;
}

const ProfileTab = ({ user, profile, handleLogout }: ProfileTabProps) => {
  const [username, setUsername] = useState(profile?.username || "");
  const [isSaving, setIsSaving] = useState(false);

  const updateProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-gray-900 text-white border-gray-700">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input 
              value={user?.email || ""} 
              disabled 
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nome de usuário</label>
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={updateProfile} 
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
