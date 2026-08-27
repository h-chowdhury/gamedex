import { Link } from 'react-router-dom';

export function GameCard ({gameData}) {

  if (!gameData) return null;

  const gameId = gameData.id || gameData.game_id;
  const title = gameData.name || gameData.game_title;
  const releaseDate = gameData.released || "";
  const coverImage = gameData.background_image || gameData.gameData?.background_image || null;

  return (
    <Link
      to={`/game/${gameId}`}
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
          <img 
            src={coverImage || 'https://via.placeholder.com/290x210'} 
            alt={title} 
            // style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute bottom-[80%] left-[12%] w-[76%] z-20 font-vt323 flex flex-col">
          <h2 className="text-2xl p-0 m-0">{title}</h2>
          <p className="p-0 m-0">{releaseDate}</p>
        </div>
      </div>
    </Link>
  )

}