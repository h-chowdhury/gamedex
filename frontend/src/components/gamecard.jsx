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
      <div className="relative h-[290px] w-[210px] flex-shrink-0 transition-all duration-200 hover:-translate-y-1.5">
        <img
          src="/cartridge.png"
          alt="Cartridge base"
          className="h-full w-full inset-0 object-contain pointer-events-none z-0 [image-rendering:pixelated]"
        />

        <div className="absolute top-[24%] left-[12.5%] h-[63.5%] w-[75%] overflow-hidden z-10">
          <img 
            src={coverImage || 'https://via.placeholder.com/290x210'} 
            alt={title} 
            // style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute top-[7%] left-[12%] w-[76%] z-20 font-vt323 text-sm/4 flex flex-col">
          <h2 className="text-[1.3em] text-slate-900 p-0 m-0">{title}</h2>
          {/* <p className="absolute">{releaseDate}</p> */}
        </div>
      </div>
    </Link>
  )

}