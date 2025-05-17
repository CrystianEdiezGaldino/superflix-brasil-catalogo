import { User } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Shield, Clock } from "lucide-react";

interface AdminInfoCardProps {
  user: User | null;
}

const AdminInfoCard = ({ user }: AdminInfoCardProps) => {
  return (
    <Card className="bg-netflix-dark border-netflix-red mb-8 hover:border-netflix-red/80 transition-colors">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-netflix-red/10 rounded-lg">
              <Shield className="h-5 w-5 text-netflix-red" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Informações do Administrador</h3>
              <p className="text-sm text-gray-400">Detalhes da sua conta administrativa</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <Mail className="h-5 w-5 text-netflix-red" />
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <p className="text-white">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <Clock className="h-5 w-5 text-netflix-red" />
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Último Login</label>
                <p className="text-white">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Nunca'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminInfoCard; 