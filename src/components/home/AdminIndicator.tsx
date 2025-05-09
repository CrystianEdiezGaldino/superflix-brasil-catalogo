
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminIndicator = () => {
  return (
    <div className="mb-6 px-4">
      <Link to="/admin">
        <Button variant="outline" className="border-netflix-red text-netflix-red hover:bg-netflix-red/20">
          Acessar Painel de Administração
        </Button>
      </Link>
    </div>
  );
};

export default AdminIndicator;
