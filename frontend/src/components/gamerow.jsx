import { GameCard } from './gamecard.jsx'

export function GameRow ({ title, games }) {
  
  if (!games) {
    return;
  }

  return (
  <div className="">
    <div className="pixel-box-lg w-full my-6 bg-[#1c1c28]">
      <section className="p-5 space-y-4">
        
        <div className="flex items-center gap-3 border-b-4 border-[#2c2c3e] pb-3">
          <div className="w-2.5 h-2.5 bg-[#83c5be] mb-1 mr-1" />
          <h2 className="text-[#f4a261] font-press-start text-xs md:text-sm uppercase tracking-wider">
            {title}
          </h2>
        </div>

        <div className="flex flex-row gap-5 overflow-x-auto pt-2 scrollbar-thin scrollbar-thumb-[#f4a261] scrollbar-track-[#2c2c3e]">
          {games && games.length > 0 ? (
            games.map((game) => (
              <div key={game.id || game._id} className="flex-shrink-0">
                <GameCard gameData={game} />
              </div>
            ))
          ) : (
            <p className="text-[#a8a8b3] font-vt323 text-xl py-2 mb-1 flex justify-center align-center w-full">
              [ NO GAMES FOUND ]
            </p>
          )}
        </div>

      </section>
    </div>
  </div>
  );
}