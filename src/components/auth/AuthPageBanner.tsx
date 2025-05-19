import { motion } from "framer-motion";

const AuthPageBanner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center justify-center p-4 mb-8 bg-black/30 backdrop-blur-sm rounded-full shadow-lg border border-white/10">
        <img
          src="/lovable-uploads/efa84daa-353c-4a55-836f-0baef660aba2.png"
          alt="NaflixTV Logo"
          className="h-[120px] transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Bem-vindo ao NaflixTV
      </h2>
      <p className="text-xl text-gray-300 max-w-md mx-auto">
        Todos os conteúdos em um só lugar
      </p>
    </motion.div>
  );
};

export default AuthPageBanner;
