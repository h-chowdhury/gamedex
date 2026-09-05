import { Link } from 'react-router-dom';
import clickAudio from "/audio/click.mp3";

export function GameCard ({gameData}) {

  if (!gameData) return null;

  const clickSound = new Audio(clickAudio);

  const gameId = gameData.id || gameData.game_id;
  const title = gameData.name || gameData.game_title;
  const releaseDate = gameData.released || "";
  const coverImage = gameData.background_image || gameData.gameData?.background_image || null;

  const date = new Date(releaseDate);
  const formattedDate = date.toLocaleDateString('en-GB')

  return (
    <Link
      to={`/game/${gameId}`}
      state={{ game: gameData }}
      className="cursor-pointer flex-shrink-0 block"
      onClick={() => clickSound.play()}
    >
      <div className="relative h-[220px] w-[160px] transition-all duration-200 hover:-translate-y-1">
        <img
          src="/cartridge.png"
          alt="Cartridge base"
          className="h-full w-full inset-0 object-contain pointer-events-none z-0 [image-rendering:pixelated]"
        />

        <div className="absolute top-[24%] left-[12.5%] h-[63.5%] w-[75%] overflow-hidden z-10">
          <img 
            src={coverImage || 'https://via.placeholder.com/220x160'} 
            alt={title} 
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute top-[9%] left-[13%] w-[68%] z-20 font-press-start">
          <h2 className="text-[0.5em] text-[#1c1c28] p-0 m-0 text-xs/3 line-clamp-2 break-words">
            {title}
          </h2>
        </div>

        {releaseDate && (
          <div className="absolute bottom-[2%] left-[12.5%] w-[75%] z-20 font-vt323 text-center">
            <span className="text-[#47464f] font-bold text-sm px-1.5 py-0.5 pixel-box tracking-wider">
              {formattedDate}
            </span>
          </div>
        )}
        
      </div>
    </Link>
  )

}