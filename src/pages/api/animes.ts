
export default async function handler(req, res) {
  try {
    // Update to new domain
    const response = await fetch('https://superflixapi.ist/animes/export/');
    
    if (!response.ok) {
      throw new Error(`Error fetching anime IDs: ${response.status}`);
    }
    
    const data = await response.text();
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    // Return the data directly
    return res.status(200).send(data);
  } catch (error) {
    console.error('Error in animes API route:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch anime IDs',
      message: error.message 
    });
  }
}
