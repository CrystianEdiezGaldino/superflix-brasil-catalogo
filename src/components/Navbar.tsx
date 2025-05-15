import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-black/90 backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-red-600 text-2xl font-bold">
            SuperFlix
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/filmes">
              <Button variant="ghost" className="text-white hover:text-red-600">
                Filmes
              </Button>
            </Link>
            <Link to="/series">
              <Button variant="ghost" className="text-white hover:text-red-600">
                Séries
              </Button>
            </Link>
            <Link to="/favoritos">
              <Button variant="ghost" className="text-white hover:text-red-600">
                Favoritos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
