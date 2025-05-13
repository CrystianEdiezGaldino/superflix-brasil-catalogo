
import { MediaItem } from "@/types/movie";
import Banner from "@/components/Banner";
import TrialNotification from "./TrialNotification";
import SubscriptionUpsell from "./SubscriptionUpsell";
import AdminIndicator from "./AdminIndicator";
import RecentReleases from "./sections/RecentReleases";
import { useContentCalendar } from "@/hooks/useContentCalendar";

interface HomeHeaderProps {
  featuredMedia: MediaItem | null;
  isAdmin: boolean;
  hasAccess: boolean;
  hasTrialAccess: boolean;
  trialEnd: string | null;
  searchQuery: string;
}

const HomeHeader = ({ 
  featuredMedia, 
  isAdmin, 
  hasAccess, 
  hasTrialAccess,
  trialEnd,
  searchQuery 
}: HomeHeaderProps) => {
  const { recentContent, isLoading } = useContentCalendar();

  return (
    <div className="relative">
      {/* Show Banner only when not searching */}
      {!searchQuery && featuredMedia && (
        <Banner media={featuredMedia} />
      )}
      
      {/* Trial notification for users with trial access */}
      {hasTrialAccess && <TrialNotification trialEnd={trialEnd} />}
      
      {/* Upsell for non-subscribers */}
      {!hasAccess && <SubscriptionUpsell />}
      
      {/* Admin indicator */}
      {isAdmin && <AdminIndicator />}
      
      {/* Recent Releases Section with improved styling */}
      {hasAccess && !searchQuery && (
        <div className="mb-8 px-4 md:px-8 mt-6">
          <div className="bg-gradient-to-r from-black/60 to-transparent p-4 md:p-6 rounded-xl">
            <RecentReleases releases={recentContent} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeHeader;
