import { Navbar } from './components/navbar.jsx';
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom';

// Styles
const h1style = 'text-slate-200 font-vt323 text-4xl';
const h2style = 'text-slate-200 font-vt323 text-2xl uppercase';

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay)
  };
}

// const search = async (query) => {
//   try {
//     const res = await fetch(`http://localhost:5000/api/games?search=${encodeURIComponent(query)}`);
//     const data = await res.json();
//     return data.results;
//   } catch (err) {
//     console.error("Failed to fetch games:", err);
//     return [];
//   }
// }

// const searchGame = debounce(search, 500);


function GameCard ({gameData}) {

  if (!gameData) return null;

  return (
    <Link
      to={`/game/${gameData.id}`}
      state={{ game: gameData }}
      className="cursor-pointer"
    >
      <div className="relative pixel-box h-[290px] w-[210px] bg-red-400 flex-shrink-0 transition-all duration-200 hover:-translate-y-1.5">
        <img
          src="../public/cartridge.png"
          alt="Cartridge base"
          className="h-full w-full inset-0 object-contain pointer-events-none z-0"
        />

        <div className="absolute top-[25%] left-[8%] h-[68%] w-[85%] overflow-hidden z-10">
          {gameData.background_image && (
          <img 
            src={gameData.background_image || 'https://via.placeholder.com/290x210'} 
            alt={gameData.name} 
            // style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            className="h-full w-full object-cover"
          />
        )}
        </div>

        <div className="absolute bottom-[80%] left-[12%] w-[76%] z-20 font-vt323 flex flex-col">
          <h2 className="text-2xl p-0 m-0">{gameData.name}</h2>
          <p className="p-0 m-0">{gameData.released}</p>
        </div>
      </div>
    </Link>
  )

}


function DiscoveryView () {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);
  const [top40, setTop40] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollboxStyle = "flex flex-row gap-4 overflow-x-scroll pt-3";

  useEffect(() => {
    async function fetchAllCategories() {
      try {
        setLoading(true);

        const [trendingRes, upcomingRes, popularRes, top40Res] = await Promise.all([
          fetch('http://localhost:5000/api/games/trending').then(res => res.json()),
          fetch('http://localhost:5000/api/games/upcoming').then(res => res.json()),
          fetch('http://localhost:5000/api/games/popular').then(res => res.json()),
          fetch('http://localhost:5000/api/games/top-40').then(res => res.json()),
        ]);

        setTrending(trendingRes.results || trendingRes);
        setUpcoming(upcomingRes.results || upcomingRes);
        setPopular(popularRes.results || popularRes);
        setTop40(top40Res.results || top40Res);

      } catch (error) {
        console.error("Failed to load discovery sections: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllCategories();

  }, []);

  if (loading) return <div className="p-8 text-white">Loading cartridges...</div>;

  return (

    <div className="flex flex-col gap-12 p-8">

      {/*Trending games */}
      <section>
        <h2 className={h2style}>Trending games</h2>
        <div className={scrollboxStyle}>
          {trending && trending?.length > 0
            ? (trending.map((game) => (<GameCard key={game.id} gameData={game} />)))
            : (<p className="text-white">No Results</p>)
          }
        </div>
      </section>


      {/*Upcoming games */}
      <section>
        <h2 className={h2style}>Upcoming games</h2>
        <div className={scrollboxStyle}>
          {upcoming && upcoming?.length > 0
            ? (upcoming.map((game) => (<GameCard key={game.id} gameData={game} />)))
            : (<p className="text-white">No Results</p>)
          }
        </div>
      </section>


      {/*All time popular games */}
      <section>
        <h2 className={h2style}>All time popular games</h2>
        <div className={scrollboxStyle}>
          {popular && popular?.length > 0
            ? (popular.map((game) => (<GameCard key={game.id} gameData={game} />)))
            : (<p className="text-white">No Results</p>)
          }
        </div>
      </section>


      {/*Top 40 games */}
      <section>
        <h2 className={h2style}>Top 40 games</h2>
        <div className={scrollboxStyle}>
          {top40 && top40?.length > 0
            ? (top40.map((game) => (<GameCard key={game.id} gameData={game} />)))
            : (<p className="text-white">No Results</p>)
          }
        </div>
      </section>
    </div>
  );
}


function SearchView ({query, results, loading}) {

  if (loading) return <p className="text-white">Searching for "{query}"...</p>

  return (
    <div className="">
      <h2>Search: {query.charAt(0).toUpperCase() + query.slice(1)}</h2>

      {results == null || results == [] && (
        <div>
          <h2 className="text-white">No games found for "{query}".</h2>
        </div>
      )}

      <div className="grid grid-cols-5 gap-4">
        {results != null && (Array.isArray(results)
            ? results.map((game) => {return <GameCard key={game.id} gameData={game} />})
            : <GameCard gameData={results} />
        )}
      </div>
    </div>
  );
}


export function Discover() {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGames = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/games?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(() => debounce((q) => fetchGames(q), 500), []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);   
    }
  }, [searchQuery, debouncedSearch]);

  return (
    <div className="w-full bg-slate-950 text-white">

      <Navbar />

      <div className="px-20 py-5">

        <div className="flex flex-col gap-3">
          <h1 className={h1style}>Browse Games</h1>

          <div >
            <input 
              type='text' 
              placeholder="Search games..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-white bg-slate-500 font-vt323"
            />

            {searchQuery && 
              <button
                onClick={() => setSearchQuery('')}
                className="pixel-box font-press-start text-xs py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition duration-100 active:scale-[0.98]"
              >
                CLEAR
              </button>
            }
          </div>
        </div>

        {searchQuery.trim().length > 0 ? (
          <SearchView query={searchQuery} results={searchResults} loading={loading}/>
        ) : (
          <DiscoveryView />
        )}

      </div>
    </div>
  );
}
  