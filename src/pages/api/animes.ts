import { NextApiRequest, NextApiResponse } from 'next';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { page = '1' } = req.query;
    const pageNumber = parseInt(page as string);

    // Buscar animes populares
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&page=${pageNumber}&language=pt-BR`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar animes do TMDB');
    }

    const text = await response.text();
    const ids = text.split('<br>').map(id => id.trim()).filter(Boolean);

    return res.status(200).send(ids.join('<br>'));
  } catch (error) {
    console.error('Erro ao buscar animes:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
} 