
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
  const { isSubscribed, isAdmin } = useSubscription();
  
  // Return nothing if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 cursor-pointer focus:outline-none group">
          <Avatar className="h-8 w-8 border-2 border-netflix-red transition-all duration-200 group-hover:border-white group-hover:scale-105">
            <AvatarFallback className="bg-netflix-red text-white text-xs font-medium">
              {user.email?.substring(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black/90 backdrop-blur-md text-white border-netflix-gray/30 shadow-xl" align="end">
        <DropdownMenuLabel className="text-gray-300">Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-netflix-gray/30" />
        
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer hover:bg-netflix-red/10 text-gray-200 transition-colors">
            Perfil
          </DropdownMenuItem>
        </Link>
        
        <Link to="/favoritos">
          <DropdownMenuItem className="cursor-pointer hover:bg-netflix-red/10 text-gray-200 transition-colors">
            Favoritos
          </DropdownMenuItem>
        </Link>
        
        {!isSubscribed && (
          <Link to="/subscribe">
            <DropdownMenuItem className="cursor-pointer hover:bg-netflix-red/10 text-netflix-red transition-colors font-medium">
              Ativar Assinatura
            </DropdownMenuItem>
          </Link>
        )}
        
        {isAdmin && (
          <Link to="/admin">
            <DropdownMenuItem className="cursor-pointer hover:bg-netflix-red/10 text-yellow-500 transition-colors">
              Administração
            </DropdownMenuItem>
          </Link>
        )}
        
        <DropdownMenuSeparator className="bg-netflix-gray/30" />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-netflix-red/10 text-gray-200 transition-colors"
          onClick={() => signOut()}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAction;
