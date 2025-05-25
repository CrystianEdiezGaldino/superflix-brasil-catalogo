
import { useState, useEffect } from 'react';
import { MediaItem } from '@/types/movie';

// Lista de séries populares no Brasil com dados estáticos
const popularBrazilianSeries: MediaItem[] = [
  {
    id: 1402,
    name: "Sobrenatural",
    title: "Sobrenatural",
    overview: "Dois irmãos caçam criaturas sobrenaturais pelo país.",
    poster_path: "/KoYWXbnYuS3b0GyQPkbuexlVK9.jpg",
    backdrop_path: "/o9OKe3M06QMLOzTl3l6GStYtnE9.jpg",
    first_air_date: "2005-09-13",
    media_type: "tv",
    vote_average: 8.3,
    vote_count: 2500,
    original_language: "en",
    original_name: "Supernatural",
    popularity: 87.6
  },
  {
    id: 2,
    name: "Dois Homens e Meio",
    title: "Dois Homens e Meio",
    overview: "Comédia sobre dois irmãos vivendo juntos com o filho de um deles.",
    poster_path: "/dPCv0RaOj2pRxZcUDOoqXFe7Pqn.jpg",
    backdrop_path: "/dPCv0RaOj2pRxZcUDOoqXFe7Pqn.jpg",
    first_air_date: "2003-09-22",
    media_type: "tv",
    vote_average: 7.8,
    vote_count: 1500,
    original_language: "en",
    original_name: "Two and a Half Men",
    popularity: 85.4
  },
  {
    id: 3,
    name: "The Big Bang Theory",
    title: "The Big Bang Theory",
    overview: "Quatro físicos nerds e sua vizinha enfrentam situações hilariantes.",
    poster_path: "/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg",
    backdrop_path: "/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg",
    first_air_date: "2007-09-24",
    media_type: "tv",
    vote_average: 8.1,
    vote_count: 2000,
    original_language: "en",
    original_name: "The Big Bang Theory",
    popularity: 92.7
  },
  {
    id: 6,
    name: "Friends",
    title: "Friends",
    overview: "Seis amigos vivem aventuras e romances em Nova York.",
    poster_path: "/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    backdrop_path: "/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    first_air_date: "1994-09-22",
    media_type: "tv",
    vote_average: 8.4,
    vote_count: 3000,
    original_language: "en",
    original_name: "Friends",
    popularity: 98.9
  },
  {
    id: 10001,
    name: "Eu, a Patroa e as Crianças",
    title: "Eu, a Patroa e as Crianças",
    overview: "Comédia familiar sobre um pai de família e suas aventuras cotidianas.",
    poster_path: "/l8jcPMhKWbHhGr3lTwRZ8VGmBzJ.jpg",
    backdrop_path: "/l8jcPMhKWbHhGr3lTwRZ8VGmBzJ.jpg",
    first_air_date: "2001-03-28",
    media_type: "tv",
    vote_average: 7.5,
    vote_count: 800,
    original_language: "en",
    original_name: "My Wife and Kids",
    popularity: 75.2
  },
  {
    id: 10002,
    name: "Largados e Pelados",
    title: "Largados e Pelados",
    overview: "Reality show de sobrevivência onde participantes enfrentam a natureza sem roupas.",
    poster_path: "/qQvfMIEfN25ZhVH8pblsOJX2k8l.jpg",
    backdrop_path: "/qQvfMIEfN25ZhVH8pblsOJX2k8l.jpg",
    first_air_date: "2013-06-23",
    media_type: "tv",
    vote_average: 6.8,
    vote_count: 400,
    original_language: "en",
    original_name: "Naked and Afraid",
    popularity: 65.3
  },
  {
    id: 1396,
    name: "Breaking Bad",
    title: "Breaking Bad",
    overview: "Um professor de química se torna produtor de metanfetamina.",
    poster_path: "/3xnWaLQjelJDDF7LT1WBo6f4BRe.jpg",
    backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    first_air_date: "2008-01-20",
    media_type: "tv",
    vote_average: 9.5,
    vote_count: 5000,
    original_language: "en",
    original_name: "Breaking Bad",
    popularity: 95.8
  },
  {
    id: 1399,
    name: "Game of Thrones",
    title: "Game of Thrones",
    overview: "Famílias nobres lutam pelo controle dos Sete Reinos de Westeros.",
    poster_path: "/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg",
    backdrop_path: "/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    first_air_date: "2011-04-17",
    media_type: "tv",
    vote_average: 9.3,
    vote_count: 8000,
    original_language: "en",
    original_name: "Game of Thrones",
    popularity: 120.5
  },
  {
    id: 10003,
    name: "Todo Mundo Odeia o Chris",
    title: "Todo Mundo Odeia o Chris",
    overview: "Comédia sobre a adolescência de Chris Rock nos anos 80.",
    poster_path: "/3FjakKDnWjdHV4bEPLBzbm8aJJA.jpg",
    backdrop_path: "/3FjakKDnWjdHV4bEPLBzbm8aJJA.jpg",
    first_air_date: "2005-09-22",
    media_type: "tv",
    vote_average: 8.0,
    vote_count: 1200,
    original_language: "en",
    original_name: "Everybody Hates Chris",
    popularity: 78.4
  },
  {
    id: 10004,
    name: "How I Met Your Mother",
    title: "How I Met Your Mother",
    overview: "Ted conta aos filhos como conheceu a mãe deles.",
    poster_path: "/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
    backdrop_path: "/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg",
    first_air_date: "2005-09-19",
    media_type: "tv",
    vote_average: 8.3,
    vote_count: 2800,
    original_language: "en",
    original_name: "How I Met Your Mother",
    popularity: 88.9
  },
  {
    id: 10005,
    name: "The Walking Dead",
    title: "The Walking Dead",
    overview: "Sobreviventes enfrentam um apocalipse zumbi.",
    poster_path: "/rqeYMLryjcawh2JeRpCVUDXYM5b.jpg",
    backdrop_path: "/rqeYMLryjcawh2JeRpCVUDXYM5b.jpg",
    first_air_date: "2010-10-31",
    media_type: "tv",
    vote_average: 8.2,
    vote_count: 4500,
    original_language: "en",
    original_name: "The Walking Dead",
    popularity: 89.7
  },
  {
    id: 10006,
    name: "Lost",
    title: "Lost",
    overview: "Sobreviventes de um acidente aéreo ficam presos em uma ilha misteriosa.",
    poster_path: "/og6S0aTZU6YUJAbqxeKjCa3kY1E.jpg",
    backdrop_path: "/og6S0aTZU6YUJAbqxeKjCa3kY1E.jpg",
    first_air_date: "2004-09-22",
    media_type: "tv",
    vote_average: 8.3,
    vote_count: 3200,
    original_language: "en",
    original_name: "Lost",
    popularity: 82.6
  },
  {
    id: 10007,
    name: "Prison Break",
    title: "Prison Break",
    overview: "Um homem elabora um plano para tirar seu irmão da prisão.",
    poster_path: "/5E1BhkCgjLBlqx557Z5yzcN0i88.jpg",
    backdrop_path: "/5E1BhkCgjLBlqx557Z5yzcN0i88.jpg",
    first_air_date: "2005-08-29",
    media_type: "tv",
    vote_average: 8.3,
    vote_count: 2600,
    original_language: "en",
    original_name: "Prison Break",
    popularity: 84.2
  },
  {
    id: 10008,
    name: "Grey's Anatomy",
    title: "Grey's Anatomy",
    overview: "Drama médico acompanhando a vida de cirurgiões em Seattle.",
    poster_path: "/clnyhPqj1SNgpAdeSS6a6fwE6Bo.jpg",
    backdrop_path: "/clnyhPqj1SNgpAdeSS6a6fwE6Bo.jpg",
    first_air_date: "2005-03-27",
    media_type: "tv",
    vote_average: 8.2,
    vote_count: 3800,
    original_language: "en",
    original_name: "Grey's Anatomy",
    popularity: 91.4
  },
  {
    id: 10009,
    name: "House",
    title: "House",
    overview: "Médico brilhante e sarcástico resolve casos médicos complexos.",
    poster_path: "/3Cz7ySOQJmqiuTdrc6CY0r65yDI.jpg",
    backdrop_path: "/3Cz7ySOQJmqiuTdrc6CY0r65yDI.jpg",
    first_air_date: "2004-11-16",
    media_type: "tv",
    vote_average: 8.7,
    vote_count: 4200,
    original_language: "en",
    original_name: "House",
    popularity: 87.9
  },
  {
    id: 10010,
    name: "Dexter",
    title: "Dexter",
    overview: "Analista forense que mata criminosos em seu tempo livre.",
    poster_path: "/7vEG4cqzGJdce8Pep2Uj5fX4c7I.jpg",
    backdrop_path: "/7vEG4cqzGJdce8Pep2Uj5fX4c7I.jpg",
    first_air_date: "2006-10-01",
    media_type: "tv",
    vote_average: 8.7,
    vote_count: 3900,
    original_language: "en",
    original_name: "Dexter",
    popularity: 85.3
  },
  {
    id: 10011,
    name: "The Office",
    title: "The Office",
    overview: "Comédia mockumentário sobre funcionários de um escritório.",
    poster_path: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    backdrop_path: "/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg",
    first_air_date: "2005-03-24",
    media_type: "tv",
    vote_average: 8.8,
    vote_count: 4100,
    original_language: "en",
    original_name: "The Office",
    popularity: 94.6
  },
  {
    id: 10012,
    name: "Criminal Minds",
    title: "Criminal Minds",
    overview: "Agentes do FBI criam perfis psicológicos de criminosos.",
    poster_path: "/wLMQebhTApmn4F6Fzg6FovdwVvL.jpg",
    backdrop_path: "/wLMQebhTApmn4F6Fzg6FovdwVvL.jpg",
    first_air_date: "2005-09-22",
    media_type: "tv",
    vote_average: 8.1,
    vote_count: 2300,
    original_language: "en",
    original_name: "Criminal Minds",
    popularity: 79.8
  },
  {
    id: 10013,
    name: "CSI: Crime Scene Investigation",
    title: "CSI: Crime Scene Investigation",
    overview: "Investigadores forenses resolvem crimes em Las Vegas.",
    poster_path: "/i5hmoRjHNWady4AtAGICqjvuMKI.jpg",
    backdrop_path: "/i5hmoRjHNWady4AtAGICqjvuMKI.jpg",
    first_air_date: "2000-10-06",
    media_type: "tv",
    vote_average: 7.6,
    vote_count: 1800,
    original_language: "en",
    original_name: "CSI: Crime Scene Investigation",
    popularity: 72.4
  },
  {
    id: 10014,
    name: "NCIS",
    title: "NCIS",
    overview: "Agentes especiais investigam crimes envolvendo a Marinha.",
    poster_path: "/2exOHePjOTquUsbThPGhuEjYTyA.jpg",
    backdrop_path: "/2exOHePjOTquUsbThPGhuEjYTyA.jpg",
    first_air_date: "2003-09-23",
    media_type: "tv",
    vote_average: 7.8,
    vote_count: 2100,
    original_language: "en",
    original_name: "NCIS",
    popularity: 81.7
  },
  {
    id: 10015,
    name: "Stranger Things",
    title: "Stranger Things",
    overview: "Crianças enfrentam forças sobrenaturais nos anos 80.",
    poster_path: "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    backdrop_path: "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    first_air_date: "2016-07-15",
    media_type: "tv",
    vote_average: 8.7,
    vote_count: 6200,
    original_language: "en",
    original_name: "Stranger Things",
    popularity: 112.8
  },
  {
    id: 10016,
    name: "The Simpsons",
    title: "Os Simpsons",
    overview: "Família amarela vive aventuras cômicas em Springfield.",
    poster_path: "/zLudbPueg8CxGhMS2tyDh3p0TdK.jpg",
    backdrop_path: "/zLudbPueg8CxGhMS2tyDh3p0TdK.jpg",
    first_air_date: "1989-12-17",
    media_type: "tv",
    vote_average: 8.7,
    vote_count: 5800,
    original_language: "en",
    original_name: "The Simpsons",
    popularity: 103.2
  },
  {
    id: 10017,
    name: "South Park",
    title: "South Park",
    overview: "Quatro garotos vivem aventuras polêmicas no Colorado.",
    poster_path: "/xJnbMTrJ2fl1AXAKx34U4BPvOhs.jpg",
    backdrop_path: "/xJnbMTrJ2fl1AXAKx34U4BPvOhs.jpg",
    first_air_date: "1997-08-13",
    media_type: "tv",
    vote_average: 8.4,
    vote_count: 3400,
    original_language: "en",
    original_name: "South Park",
    popularity: 86.5
  },
  {
    id: 10018,
    name: "Family Guy",
    title: "Family Guy",
    overview: "Família disfuncional vive situações absurdas e cômicas.",
    poster_path: "/eWWCRjBfLyePh2tfZdvNcIvKVQQ.jpg",
    backdrop_path: "/eWWCRjBfLyePh2tfZdvNcIvKVQQ.jpg",
    first_air_date: "1999-01-31",
    media_type: "tv",
    vote_average: 7.1,
    vote_count: 2600,
    original_language: "en",
    original_name: "Family Guy",
    popularity: 76.8
  },
  {
    id: 10019,
    name: "Modern Family",
    title: "Modern Family",
    overview: "Três famílias conectadas vivem situações hilariantes.",
    poster_path: "/klL4yhwiU8aF4AuF5dCfJA9sRnS.jpg",
    backdrop_path: "/klL4yhwiU8aF4AuF5dCfJA9sRnS.jpg",
    first_air_date: "2009-09-23",
    media_type: "tv",
    vote_average: 8.2,
    vote_count: 3100,
    original_language: "en",
    original_name: "Modern Family",
    popularity: 83.7
  },
  {
    id: 10020,
    name: "Seinfeld",
    title: "Seinfeld",
    overview: "Comédia sobre o cotidiano de um comediante em Nova York.",
    poster_path: "/aCw8ONfyz3AhngVQa1E2Ss4KSUQ.jpg",
    backdrop_path: "/aCw8ONfyz3AhngVQa1E2Ss4KSUQ.jpg",
    first_air_date: "1989-07-05",
    media_type: "tv",
    vote_average: 8.9,
    vote_count: 2900,
    original_language: "en",
    original_name: "Seinfeld",
    popularity: 89.3
  },
  {
    id: 10021,
    name: "Cheers",
    title: "Cheers",
    overview: "Comédia passada em um bar de Boston.",
    poster_path: "/7q9NTm6FkgBMtFkQ1LpQqgGVNuJ.jpg",
    backdrop_path: "/7q9NTm6FkgBMtFkQ1LpQqgGVNuJ.jpg",
    first_air_date: "1982-09-30",
    media_type: "tv",
    vote_average: 7.8,
    vote_count: 1200,
    original_language: "en",
    original_name: "Cheers",
    popularity: 68.4
  },
  {
    id: 10022,
    name: "The Fresh Prince of Bel-Air",
    title: "Um Maluco no Pedaço",
    overview: "Jovem da Filadélfia vai morar com parentes ricos em Bel-Air.",
    poster_path: "/3d6tBodi6mEzBl73mLJ5kYhFc5N.jpg",
    backdrop_path: "/3d6tBodi6mEzBl73mLJ5kYhFc5N.jpg",
    first_air_date: "1990-09-10",
    media_type: "tv",
    vote_average: 8.0,
    vote_count: 2200,
    original_language: "en",
    original_name: "The Fresh Prince of Bel-Air",
    popularity: 77.9
  },
  {
    id: 10023,
    name: "Smallville",
    title: "Smallville",
    overview: "A juventude de Clark Kent antes de se tornar Superman.",
    poster_path: "/aznhae8NS6XkgG1ce8CK8UcAHNI.jpg",
    backdrop_path: "/aznhae8NS6XkgG1ce8CK8UcAHNI.jpg",
    first_air_date: "2001-10-16",
    media_type: "tv",
    vote_average: 7.8,
    vote_count: 1900,
    original_language: "en",
    original_name: "Smallville",
    popularity: 74.6
  },
  {
    id: 10024,
    name: "24",
    title: "24 Horas",
    overview: "Jack Bauer enfrenta ameaças terroristas em tempo real.",
    poster_path: "/iq6yrZ5LEQLcxPRJJbUz3XEUdmZ.jpg",
    backdrop_path: "/iq6yrZ5LEQLcxPRJJbUz3XEUdmZ.jpg",
    first_air_date: "2001-11-06",
    media_type: "tv",
    vote_average: 8.4,
    vote_count: 2500,
    original_language: "en",
    original_name: "24",
    popularity: 80.1
  }
];

export const usePopularTVSeries = (limit: number = 30) => {
  const [popularTVSeries, setPopularTVSeries] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPopularSeries = async () => {
      setIsLoading(true);
      try {
        // Simula carregamento das séries populares brasileiras
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filtrar apenas séries que têm poster_path E backdrop_path
        const seriesWithImages = popularBrazilianSeries.filter(series => 
          series.poster_path && 
          series.backdrop_path && 
          series.poster_path !== null && 
          series.backdrop_path !== null &&
          series.poster_path.trim() !== '' &&
          series.backdrop_path.trim() !== ''
        );
        
        // Retorna as séries limitadas pela quantidade solicitada
        const limitedSeries = seriesWithImages.slice(0, limit);
        setPopularTVSeries(limitedSeries);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
        setIsLoading(false);
      }
    };
    
    loadPopularSeries();
  }, [limit]);

  return { popularTVSeries, isLoading, error };
};
