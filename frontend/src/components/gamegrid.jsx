import { GameCard } from './gamecard.jsx';

export function GameGrid ({ games, cols}) {

  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {games != null && (Array.isArray(games)
          ? games.map((game) => {return <GameCard key={game.id} gameData={game} />})
          : <GameCard gameData={games} />
      )}
    </div>
  );
}