
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserActionProps {
  isAuthenticated: boolean;
}

const UserAction = ({ isAuthenticated }: UserActionProps) => {
  return (
    <>
      {isAuthenticated ? (
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="ml-2 hover:bg-netflix-red/20">
            <User size={20} className="text-white" />
          </Button>
        </Link>
      ) : (
        <Link to="/auth">
          <Button variant="outline" size="sm" className="ml-2 border-netflix-red text-white hover:bg-netflix-red hover:text-white">
            Entrar
          </Button>
        </Link>
      )}
    </>
  );
};

export default UserAction;
