import { Navbar } from './components/navbar.jsx';
import { Footer } from './components/footer.jsx';
import { GameCard } from './components/gamecard.jsx';
import { GameRow } from './components/gamerow.jsx';
import { GameGrid } from './components/gamegrid.jsx';
import { GENRES } from '../../services/constants.js';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom'; 

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
      <GameRow title="Trending Games" selectedGenre={rowGenres.trending} games={trending} />
      <GameRow title="Upcoming Games" games={upcoming} />
      <GameRow title="All Time Popular Games" games={popular} />
      <GameRow title="Top 40 Games" games={top40} />
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

      <GameGrid games={results} cols='5' />

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
    <div className="w-full text-white">

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

      <Footer />
    </div>
  );
}
  