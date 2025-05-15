
import { Film } from "lucide-react";
import { motion } from "framer-motion";

const AuthPageBanner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center justify-center p-4 bg-netflix-red rounded-full mb-6 shadow-lg">
        <Film size={36} className="text-white" />
      </div>
      <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Bem-vindo ao SuperFlix</h2>
      <p className="text-xl text-gray-300 max-w-md mx-auto">
        Filmes, séries, animes e muito mais em um só lugar
      </p>
    </motion.div>
  );
};

export default AuthPageBanner;
