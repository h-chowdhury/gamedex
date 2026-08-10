import { Navbar } from './components/navbar.jsx';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function GameCard (gameData) {
  return (
    <div className="gameCard">
      <h2>Title: {gameData.name}</h2>
      <p>Released: {gameData.released}</p>
      <p>Description: {gameData.description_raw}</p>
      
      {gameData.background_image && (
        <img 
          src={gameData.background_image} 
          alt={gameData.name} 
          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
        />
      )}

      <p>
        Genre: {
          Array.isArray(gameData.genres)
            ? gameData.genres.map(g => g.name).join(', ')
            : gameData.genre || 'N/A'
        }
      </p>

      <p>
        Platform: {
          Array.isArray(gameData.platforms)
          ? gameData.platforms.map(p => p.platform?.name || p.name).join(', ')
          : gameData.platform || 'N/A'
        }
      </p>

      <p>Similar games: {
        gameData.similar_games?.length > 0
          ? gameData.similar_games.map(g => g.name).join(', ')
          : 'None listed'
        }
      </p>

      <p>
        Player activity: {
          typeof gameData.player_activity === 'object'
            ? `${gameData.player_activity?.current_players || 0} current players`
            : gameData.player_activity || 'N/A'
        }
      </p>

      <p>Metacritic score: {gameData.metacritic || 'N/A'}</p>
      <p>Developer: {gameData.developer}</p>
      <p>Publisher: {gameData.publisher}</p>
      <p>Creator: {gameData.creator}</p>
      
      <p>Website: {gameData.website ? <a href={gameData.website}>{gameData.website}</a> : 'N/A'}</p>

    </div>
  )

}



function DiscoveryView () {
  return (
    <div>
    <h2>Trending games</h2>

    <h2>Upcoming games</h2>

    <h2>All time popular games</h2>

    <h2>Top 100 games</h2>
  </div>
  );
}


function SearchView (query) {

}



export function Discover() {

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full max-w-7xl mx-auto lg:px-8 bg-slate-950 text-white">
      <Navbar />

      <h1>Browse Games</h1>

      <div>
        <input 
          type='text' 
          placeholder="Search games" 
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

      {searchQuery.trim().length > 0 ? (
        <SearchView query={searchQuery} />
      ) : (
        <DiscoveryView />
      )}

    </div>
  );
}
  