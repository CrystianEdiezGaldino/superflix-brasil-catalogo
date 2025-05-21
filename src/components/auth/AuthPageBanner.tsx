import { motion } from "framer-motion";
const AuthPageBanner = () => {
  return <motion.div initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-4 mb-8 px-[5px] py-[5px]w-[250px] h-[150px]">
        <img alt="NaflixTV Logo" src="/lovable-uploads/7136f69e-68f9-4ae3-9b5e-9ff6e0e62797.png" className="h-[80px] transition-transform duration-300 hover:scale-105" />
      </div>
      <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Bem-vindo ao NaflixTV
      </h2>
      <p className="text-xl text-gray-300 max-w-md mx-auto">
        Todos os conteúdos em um só lugar
      </p>
    </motion.div>;
};
export default AuthPageBanner;