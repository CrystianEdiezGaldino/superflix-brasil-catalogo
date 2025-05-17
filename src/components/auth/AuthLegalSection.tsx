import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AuthLegalSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8 text-center max-w-md px-6"
    >
      <p className="text-gray-400 text-sm">
        Ao fazer login ou criar uma conta, você concorda com nossos{" "}
        <Link to="/termos-de-servico" className="text-netflix-red hover:underline mx-1" target="_blank">
          Termos de Uso
        </Link>
        e confirma que leu nossa{" "}
        <Link to="/politica-de-privacidade" className="text-netflix-red hover:underline mx-1" target="_blank">
          Política de Privacidade
        </Link>.
      </p>
      <p className="text-gray-500 text-xs mt-4">
        Este site não é um serviço real de streaming. Projeto criado apenas para fins de demonstração e portfólio.
      </p>
    </motion.div>
  );
};

export default AuthLegalSection;
