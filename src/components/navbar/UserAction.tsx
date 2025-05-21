
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { signOutUser } from "@/utils/authUtils";

interface UserActionProps {
  isAuthenticated?: boolean;
}

const UserAction = ({ isAuthenticated = false }: UserActionProps) => {
  const { user, signOut } = useAuth();
  const { isSubscribed, isAdmin } = useSubscription();
  const navigate = useNavigate();
  
  // Return nothing if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      // Primeiro, tente usar a função signOut do contexto de autenticação
      if (typeof signOut === 'function') {
        await signOut();
      } else {
        // Se não estiver disponível, use signOutUser do authUtils
        await signOutUser();
      }
      
      // Limpar dados de sessão no localStorage
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refreshToken');
      sessionStorage.clear();
      
      // Mostrar toast antes de recarregar
      toast.success("Logout realizado com sucesso!");
      
      // Pequeno atraso para o toast ser visível
      setTimeout(() => {
        // Usar window.location.href para garantir um reload completo
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout. Tentando novamente...');
      
      // Tentar método alternativo de logout em caso de falha
      try {
        await signOutUser();
        window.location.href = '/';
      } catch (secondError) {
        console.error('Falha no segundo método de logout:', secondError);
        toast.error('Erro ao fazer logout. Por favor, tente novamente.');
      }
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 cursor-pointer focus:outline-none group">
          <Avatar className="h-[50px] w-[50px] border-2 border-netflix-red transition-all duration-200 group-hover:border-white group-hover:scale-105">
            <AvatarFallback className="bg-netflix-red text-white text-base font-medium">
              {user.email?.substring(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700">
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
          onClick={handleSignOut}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAction;
