
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const LoadingState = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Carregando conteúdo");
  const [dotCount, setDotCount] = useState(0);
  
  // Progress bar animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        // Make progress slower near the end to wait for data loading
        const increment = prevProgress < 70 ? 5 : (prevProgress < 90 ? 2 : 0.5);
        
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + increment;
      });
    }, 120);
    
    // Set a timeout to ensure we don't get stuck at 99%
    const maxTimeout = setTimeout(() => {
      setProgress(100);
    }, 15000); // 15 seconds maximum wait
    
    return () => {
      clearInterval(timer);
      clearTimeout(maxTimeout);
    };
  }, []);
  
  // Animated dots effect
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 400);
    
    return () => clearInterval(dotTimer);
  }, []);
  
  // Dynamic loading messages
  useEffect(() => {
    const messages = [
      "Carregando conteúdo",
      "Verificando assinatura",
      "Preparando sua experiência",
      "Quase pronto"
    ];
    
    const messageTimer = setInterval(() => {
      const index = Math.min(
        Math.floor(progress / 25),
        messages.length - 1
      );
      setMessage(messages[index]);
    }, 1000);
    
    return () => clearInterval(messageTimer);
  }, [progress]);
  
  return (
    <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center">
      <div className="w-16 h-16 relative mb-8">
        <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-white text-xl mb-4">
        {message}{'.'.repeat(dotCount)}
      </h2>
      <div className="w-64">
        <Progress value={progress} className="h-1.5 bg-gray-700" />
      </div>
      <p className="text-xs text-gray-400 mt-2">{Math.min(Math.round(progress), 99)}%</p>
      
      {progress > 80 && (
        <p className="text-sm text-gray-400 mt-8 max-w-md text-center px-4">
          Isso está demorando mais que o esperado. 
          Estamos verificando seu acesso e configurando sua conta...
        </p>
      )}
    </div>
  );
};

export default LoadingState;
