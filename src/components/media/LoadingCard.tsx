import { motion } from "framer-motion";

const LoadingCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-4 bg-gray-800 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse" />
      </div>
    </motion.div>
  );
};

export default LoadingCard; 