import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <img 
          src="/lovable-uploads/efa84daa-353c-4a55-836f-0baef660aba2.png"
          alt="NaflixTV Logo" 
          className="w-[350px] h-[350px] mb-8 transition-transform duration-300 hover:scale-105"
        />
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
          <p className="text-2xl text-gray-300 mb-6">Página não encontrada</p>
          <a 
            href="/" 
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            Voltar para Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
