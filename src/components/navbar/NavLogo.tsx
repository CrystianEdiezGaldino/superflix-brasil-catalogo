
import { Link } from "react-router-dom";

const NavLogo = () => {
  return (
    <Link to="/" className="mr-10">
      <h1 className="text-netflix-red text-3xl font-bold">NaFlixTV</h1>
    </Link>
  );
};

export default NavLogo;
