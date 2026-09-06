import { Navbar } from './components/navbar.jsx';
import { Footer } from './components/footer.jsx';
import { GameRow } from './components/gamerow.jsx';
import { GameGrid } from './components/gamegrid.jsx';
import { useEffect, useState, useMemo } from 'react';
import clickAudio from "/audio/click.mp3";

// Styles scaled down to match the compact retro layout
const h1style = "text-[#f4f1de] text-base font-press-start tracking-wide uppercase mb-1";
const clickSound = new Audio(clickAudio);
const APIURL = import.meta.env.VITE_API_URL || 'http://localhost:10000';


function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function DiscoveryView () {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);
  const [top40, setTop40] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [rowGenres, setRowGenres] = useState({
    trending: '',
    upcoming: '',
    popular: '',
    top40: ''
  });

  const handleGenreChange = (rowId, genreSlug) => {
    setRowGenres((prev) => ({
      ...prev,
      [rowId]: genreSlug
    }));
  };

  useEffect(() => {
    async function fetchAllCategories() {
      try {
        setLoading(true);

        const [trendingRes, upcomingRes, popularRes, top40Res] = await Promise.all([
          fetch(`${APIURL}/api/games/trending`).then(res => res.json()),
          fetch(`${APIURL}/api/games/upcoming`).then(res => res.json()),
          fetch(`${APIURL}/api/games/popular`).then(res => res.json()),
          fetch(`${APIURL}/api/games/top-40`).then(res => res.json()),
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full gap-4 font-vt323 p-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#83c5be] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-[#f4a261] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-[#e76f51] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        <p className="font-press-start text-xs text-[#f4a261] animate-pulse tracking-widest uppercase">
          LOADING CARTRIDGES...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 mt-3">
      <GameRow title="Trending Games" selectedGenre={rowGenres.trending} games={trending} />
      <GameRow title="Upcoming Games" games={upcoming} />
      <GameRow title="All Time Popular Games" games={popular} />
      <GameRow title="Top 40 Games" games={top40} />
    </div>
  );
}

function SearchView ({query, results, loading}) {

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full gap-4 font-vt323 p-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#83c5be] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-[#f4a261] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-[#e76f51] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        <p className="font-press-start text-xs text-[#f4a261] animate-pulse tracking-widest uppercase">
          Searching for "{query}"...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-vt323 my-4">
      <div className="flex items-center gap-2 mt-5">
        <div className="w-2 h-2 bg-[#83c5be] mb-2" />
        <h2 className="text-[#f4a261] mb-1.5 font-press-start text-xs uppercase tracking-wider">
          SEARCH: {query.toUpperCase()}
        </h2>
      </div>

      {results.length <= 0 ? (
        <div className="bg-[#2c2c3e]/30 p-6 text-center my-4">
          <p className="text-[#a8a8b3] text-lg">
            [ NO CARTRIDGES FOUND FOR "{query.toUpperCase()}" ]
          </p>
        </div>
      ) : (
        <GameGrid games={results} />
      )}
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
      const res = await fetch(`${APIURL}/api/games?search=${encodeURIComponent(searchQuery)}`);
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
    <div className="w-full text-white min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-2 mt-5">
            <h1 className={h1style}>BROWSE GAMES</h1>

            <div className="flex flex-row gap-3">
              <input 
                type='text' 
                placeholder="Search games..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pixel-box-sm w-full bg-[#2c2c3e] text-[#f4f1de] placeholder-[#a8a8b3]/40 font-vt323 text-lg px-4 py-1.5 focus:outline-none tracking-wide"
              />

              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    clickSound.currentTime = 0;
                    clickSound.play().catch(() => {});
                  }}
                  className="pixel-box-sm font-press-start text-[10px] py-1.5 px-3 bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer shrink-0"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {searchQuery.trim().length > 0 ? (
            <SearchView query={searchQuery} results={searchResults} loading={loading}/>
          ) : (
            <DiscoveryView />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}