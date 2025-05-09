import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface DoramaLoadingStateProps {
  isLoading: boolean;
  hasUser: boolean;
  hasError: boolean;
}

const DoramaLoadingState = ({ isLoading, hasUser, hasError }: DoramaLoadingStateProps) => {
  const navigate = useNavigate();

  if (!hasUser) {
    navigate("/auth");
    return null;
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-netflix-background flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-2">Dorama não encontrado</h2>
        <p className="text-gray-400">O dorama solicitado não está disponível ou não existe.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background">
        <div className="pt-20">
          <Skeleton className="w-full h-[70vh]" />
          <div className="px-4 md:px-8 py-6">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-32 w-full mb-8" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DoramaLoadingState; 