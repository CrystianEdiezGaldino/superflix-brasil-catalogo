import { cn } from '@/lib/utils';

interface MediaCardSkeletonProps {
  className?: string;
}

const MediaCardSkeleton = ({ className }: MediaCardSkeletonProps) => {
  return (
    <div className={cn('relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-netflix-gray/20', className)}>
      <div className="absolute inset-0 animate-pulse">
        <div className="h-full w-full bg-gradient-to-b from-transparent to-netflix-gray/40" />
      </div>
    </div>
  );
};

export default MediaCardSkeleton; 