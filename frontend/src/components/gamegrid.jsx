import { GameCard } from './gamecard.jsx';

export function GameGrid ({ title, games, cols = 5}) {

  return (
  <div className="font-vt323">
    
    {title && (
      <div className="flex items-center gap-2 border-b-2 max-w border-[#2c2c3e] pb-2 mb-5">
        <div className="w-2 h-2 bg-[#83c5be] mb-1 mr-1.5" />
        <h2 className="text-[#f4a261] font-press-start text-xs uppercase tracking-wider">
          {title}
        </h2>
      </div>
    )}

    <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(140px,160px))] justify-center gap-4">
      {games && games.length > 0 ? (
        games.map((game) => (
            <GameCard key={game.id || game._id} gameData={game} />
        ))
      ) : (
        <div className="pixel-box-sm col-span-full bg-[#2c2c3e]/30 p-4 text-center">
          <p className="text-[#a8a8b3] text-base">
            [ NO GAMES FOUND ]
          </p>
        </div>
      )}
    </div>

  </div>
);
}