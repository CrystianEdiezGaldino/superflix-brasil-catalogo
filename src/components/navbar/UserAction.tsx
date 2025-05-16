
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface UserActionProps {
  isAuthenticated?: boolean;
}

const UserAction = ({ isAuthenticated = false }: UserActionProps) => {
  const { user, signOut } = useAuth();
  const { hasValidSubscription, isAdmin } = useSubscription();
  
  // Return nothing if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 cursor-pointer focus:outline-none">
          <Avatar className="h-8 w-8 border-2 border-netflix-red">
            <AvatarFallback className="bg-netflix-red text-white text-xs">
              {user.email?.substring(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-netflix-card text-white border-netflix-gray" align="end">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-netflix-gray/30" />
        
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer hover:bg-netflix-hover text-gray-200">
            Perfil
          </DropdownMenuItem>
        </Link>
        
        <Link to="/favoritos">
          <DropdownMenuItem className="cursor-pointer hover:bg-netflix-hover text-gray-200">
            Favoritos
          </DropdownMenuItem>
        </Link>
        
        {!hasValidSubscription && (
          <Link to="/subscribe">
            <DropdownMenuItem className="cursor-pointer hover:bg-netflix-hover text-netflix-red">
              Ativar Assinatura
            </DropdownMenuItem>
          </Link>
        )}
        
        {isAdmin && (
          <Link to="/admin">
            <DropdownMenuItem className="cursor-pointer hover:bg-netflix-hover text-yellow-500">
              Administração
            </DropdownMenuItem>
          </Link>
        )}
        
        <DropdownMenuSeparator className="bg-netflix-gray/30" />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-netflix-hover text-gray-200"
          onClick={() => signOut()}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAction;
