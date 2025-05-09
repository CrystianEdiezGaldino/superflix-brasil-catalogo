
import { Link } from "react-router-dom";
import { Series } from "@/types/movie";
import { Card } from "@/components/ui/card";
import DoramaVideoPreview from "./DoramaVideoPreview";

interface DoramaCardProps {
  dorama: Series;
  videoKey?: string;
}

const DoramaCard = ({ dorama, videoKey }: DoramaCardProps) => {
  const linkPath = `/serie/${dorama.id}`;
  const title = dorama.name;
  const rating = dorama.vote_average ? Math.round(dorama.vote_average * 10) / 10 : null;
  
  return (
    <Card className="bg-transparent border-none overflow-hidden group">
      <Link 
        to={linkPath}
        className="block overflow-hidden rounded-lg transition-transform duration-300 relative"
      >
        <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden">
          <DoramaVideoPreview dorama={dorama} videoId={videoKey} />
        </div>
        
        <div className="mt-2 text-sm text-white truncate">{title}</div>
      </Link>
    </Card>
  );
};

export default DoramaCard;
