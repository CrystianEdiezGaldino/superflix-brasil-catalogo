
import { MediaItem } from "@/types/movie";
import Banner from "@/components/Banner";
import TrialNotification from "./TrialNotification";
import SubscriptionUpsell from "./SubscriptionUpsell";
import AdminIndicator from "./AdminIndicator";

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
    </div>
  );
};

export default HomeHeader;
