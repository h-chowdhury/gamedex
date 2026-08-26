import { Link } from 'react-router-dom';

export function GameCard ({gameData}) {

  if (!gameData) return null;

  return (
    <Link
      to={`/game/${gameData.id}`}
      state={{ game: gameData }}
      className="cursor-pointer"
    >
      <div className="relative pixel-box h-[290px] w-[210px] bg-red-400 flex-shrink-0 transition-all duration-200 hover:-translate-y-1.5">
        <img
          src="../public/cartridge.png"
          alt="Cartridge base"
          className="h-full w-full inset-0 object-contain pointer-events-none z-0"
        />

        <div className="absolute top-[25%] left-[8%] h-[68%] w-[85%] overflow-hidden z-10">
          {gameData.background_image && (
          <img 
            src={gameData.background_image || 'https://via.placeholder.com/290x210'} 
            alt={gameData.name} 
            // style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            className="h-full w-full object-cover"
          />
        )}
        </div>

        <div className="absolute bottom-[80%] left-[12%] w-[76%] z-20 font-vt323 flex flex-col">
          <h2 className="text-2xl p-0 m-0">{gameData.name}</h2>
          <p className="p-0 m-0">{gameData.released}</p>
        </div>
      </div>
    </Link>
  )

}