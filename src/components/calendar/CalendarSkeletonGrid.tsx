
import { Skeleton } from "@/components/ui/skeleton";

interface CalendarSkeletonGridProps {
  count?: number;
}

const CalendarSkeletonGrid = ({ count = 6 }: CalendarSkeletonGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="w-full aspect-[2/3] rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
};

export default CalendarSkeletonGrid;
