import { Skeleton } from "@/components/ui/skeleton";

interface SeriesLoadingStateProps {
  isLoading: boolean;
  hasUser: boolean;
  hasError: boolean;
}

const SeriesLoadingState = ({ isLoading, hasUser, hasError }: SeriesLoadingStateProps) => {
  if (!isLoading) return null;

  return (
    <div className="min-h-screen bg-netflix-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Content Skeleton */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesLoadingState; 