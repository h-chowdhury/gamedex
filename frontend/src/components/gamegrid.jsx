import { GameCard } from './gamecard.jsx';

export function GameGrid ({ title, games, cols = 5}) {

  const gridColsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const gridClass = gridColsMap[cols] || 'grid-cols-5';

  return (
    <div>

      {title && <h2 className='text-slate-200 font-vt323 text-2xl uppercase'>{title}</h2>}

      <div className={`grid ${gridClass} gap-4`}>
        {games && games?.length > 0
            ? (games.map((game, index) => (<GameCard key={game.id || game._id} gameData={game} />)))
            : (<p className="text-white">No games to display.</p>)
          }
      </div>

    </div>
  );
}