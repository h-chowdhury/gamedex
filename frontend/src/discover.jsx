import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';



function gameCard (gameData) {
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







export function Discover() {






  return (
    <div>
      <input 
        type='text' 
        placeholder="Search GameDex" 
        name="gameSearch"
      />






    </div>
  );
}
  