import { GameCard } from './gamecard.jsx'

export function GameRow ({ title, games }) {
  
  if (!games) {
    return;
  }

  return (
    <section>
      <h2 className='text-slate-200 font-vt323 text-2xl uppercase'>{title}</h2>
      <div className='flex flex-row gap-4 overflow-x-scroll pt-3'>
        {games && games?.length > 0
          ? (games.map((game, index) => (<GameCard key={game.id || game._id} gameData={game} />)))
          : (<p className="text-white">No games to display.</p>)
        }
      </div>
    </section>
  );
}