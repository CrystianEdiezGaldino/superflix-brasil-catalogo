
import Navbar from "@/components/Navbar";

const AnimeLoadingState = () => {
  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      <div className="h-[40vh] bg-gradient-to-b from-gray-900 to-netflix-background animate-pulse">
        {/* Banner placeholder */}
      </div>
      
      <div className="container mx-auto px-4 mt-[-100px] relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* Title placeholder */}
          <div className="h-10 bg-gray-800 rounded-md w-3/4 mb-6 animate-pulse"></div>
          
          {/* Button placeholder */}
          <div className="h-12 bg-gray-800 rounded-md w-48 mb-8 animate-pulse"></div>
          
          <div className="flex flex-col md:flex-row gap-8 mt-10">
            {/* Poster placeholder */}
            <div className="w-full md:w-1/3">
              <div className="aspect-[2/3] bg-gray-800 rounded-md animate-pulse"></div>
            </div>
            
            {/* Content placeholders */}
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-800 rounded-md w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded-md w-full animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded-md w-full animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded-md w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeLoadingState;
