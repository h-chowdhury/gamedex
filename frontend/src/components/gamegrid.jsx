import { GameCard } from './gamecard.jsx';

export function GameGrid ({ title, games, cols = 5}) {

  return (
  <div className="space-y-4 font-vt323">
    
    {title && (
      <div className="flex items-center gap-3 border-b-4 max-w border-[#2c2c3e] pb-2">
        <div className="w-2.5 h-2.5 bg-[#83c5be]" />
        <h2 className="text-[#f4a261] font-press-start text-sm uppercase tracking-wider">
          {title}
        </h2>
      </div>
    )}

    <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(180px,200px))] justify-center gap-6">
      {games && games.length > 0 ? (
        games.map((game) => (
            <GameCard key={game.id || game._id} gameData={game} />
        ))
      ) : (
        <div className="col-span-full bg-[#2c2c3e]/30 p-6 text-center">
          <p className="text-[#a8a8b3] text-xl">
            [ No games found. ]
          </p>
        </div>
      )}
    </div>

  </div>
);
}