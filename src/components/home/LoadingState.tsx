
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const LoadingState = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 100);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
      <div className="w-16 h-16 relative mb-8">
        <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-white text-xl mb-4">Carregando conteúdo</h2>
      <div className="w-64">
        <Progress value={progress} className="h-1 bg-gray-700" />
      </div>
    </div>
  );
};

export default LoadingState;
