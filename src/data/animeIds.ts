
// List of anime IDs from TMDB
export const animeIdsList = [
  60625, 121787, 94693, 80713, 1988, 607, 4229, 134581, 670, 34158, 2405, 1720, 
  3611, 255, 4334, 129959, 202864, 109934, 127714, 114477, 139551, 194774, 
  129516, 205493, 202770, 93741, 114183, 2808, 89456, 70881, 122287, 124363, 
  110642, 126437, 133387, 195924, 134843, 196040, 45997, 156218, 129195, 115694, 
  133197, 157842, 130765, 156450, 195966, 111576, 92892, 137194, 138882, 117933, 
  154901, 119495, 105779, 158131, 158138, 106055, 154494, 93655, 117889, 46345, 
  122369, 897, 90855, 115911, 64196, 139161, 202160, 203340, 138183, 96316, 
  194829, 118956, 96884, 157345
  // We're only including the first 100 IDs for performance, more can be added as needed
];

// Function to batch anime IDs for efficient API calls
export const getAnimeBatches = (batchSize = 20): number[][] => {
  const batches: number[][] = [];
  for (let i = 0; i < animeIdsList.length; i += batchSize) {
    batches.push(animeIdsList.slice(i, i + batchSize));
  }
  return batches;
};

// Function to get anime IDs for specific categories (slicing the list in different ways)
export const getCategoryAnimeIds = () => {
  return {
    trending: animeIdsList.slice(0, 15),
    popular: animeIdsList.slice(15, 30),
    topRated: animeIdsList.slice(30, 45),
    recent: animeIdsList.slice(45, 60),
    seasonal: animeIdsList.slice(60, 75)
  };
};
