import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AuthLegalSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-12 text-center max-w-2xl mx-auto px-6"
    >
      <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10">
        <p className="text-gray-300 text-sm mb-4">
          Ao fazer login ou criar uma conta, você concorda com nossos{" "}
          <Link to="/termos-de-servico" className="text-netflix-red hover:underline mx-1" target="_blank">
            Termos de Uso
          </Link>
          e confirma que leu nossa{" "}
          <Link to="/politica-de-privacidade" className="text-netflix-red hover:underline mx-1" target="_blank">
            Política de Privacidade
          </Link>.
        </p>
        <p className="text-gray-400 text-xs">
          Este site não é um serviço real de streaming. Projeto criado apenas para fins de demonstração e portfólio.
        </p>
      </div>
    </motion.div>
  );
};

export default AuthLegalSection;
