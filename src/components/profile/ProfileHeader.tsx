
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface ProfileHeaderProps {
  isAdmin: boolean;
}

const ProfileHeader = ({ isAdmin }: ProfileHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-white mb-6">Meu Perfil</h1>
      
      {/* Admin Panel Link - Only visible for admin users */}
      {isAdmin && (
        <div className="mb-6">
          <Link to="/admin">
            <Button 
              variant="outline" 
              className="border-netflix-red text-netflix-red hover:bg-netflix-red/20 flex items-center gap-2"
            >
              <Shield size={20} />
              Acessar Painel de Administração
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
