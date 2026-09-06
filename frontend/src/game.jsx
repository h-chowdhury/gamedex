import { Navbar } from './components/navbar.jsx';
import { Footer } from './components/footer.jsx';
import { useCallback, useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from './context/authContext.jsx';
import { GAME_STATUS, STATUS_MAP, STAR_MAP, STATUS_COLOURS, STATUS_COLOURS_LOW } from '../../backend/services/constants.js';
import { getUserIdFromToken } from '../../backend/services/authServices.js'
import clickAudio from "/audio/click.mp3";

const APIURL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

function ViewEntry({ game, close, onEntryUpdated }) {

  const clickSound = new Audio(clickAudio);

  const [formData, setFormData] = useState({
    status: GAME_STATUS.WANT_TO_PLAY,
    score: 0,
    hours_played: 0,
    start_date: '',
    finish_date: '',
    total_replays: 0,
    favourite: false,
    notes: '',
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);


  useEffect(() => {
    const fetchEntry = async () => {
      const userId = getUserIdFromToken();
      if (!userId || !game?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${APIURL}/api/fetch-entry?userId=${userId}&gameId=${game.id}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });

        if (!res.ok) {
          throw new Error(`Error fetching game entry. Server status: ${res.status}`)
        }

        const data = await res.json();
        const entry = data.data;

        if (entry) {
          setFormData({
            status: entry.status || GAME_STATUS.WANT_TO_PLAY,
            score: entry.score ?? 0,
            hours_played: entry.hours_played ?? 0,
            start_date: entry.start_date || '',
            finish_date: entry.finish_date || '',
            total_replays: entry.total_replays || 0,
            favourite: Boolean(entry.favourite) || false,
            notes: entry.notes || '',
          });
        }

      } catch (err) {
        console.error("Failed to fetch game entry:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();

  }, [game?.id]);


  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Session expired. Please login again.");
      return;
    }

    try {

      const res = await fetch(`${APIURL}/api/save-entry`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameId: game.id,
          gameTitle: game.name,
          gameImage: game.background_image,
          gameReleased: game.released,
          gameGenres: game.genres,
          formData,
        }),
      });

      if (res.ok) {
        await onEntryUpdated();
        close();
      }

    } catch (err) {
      alert("Failed to save game entry. Please try again.")
      console.error("Failed to save game entry:", err)
    }
  
  };

  const handleDelete = async () => {

    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Session expired. Please login again.");
      return;
    }
    
    try {
      const res = await fetch(`${APIURL}/api/delete-entry`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          gameId: game.id,
          gameTitle: game.name,
          gameImage: game.background_image
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete entry on server.");
      }

      setFormData({
        status: 'plan_to_play',
        score: 0,
        hours_played: 0,
        start_date: '',
        finish_date: '',
        total_replays: 0,
        favourite: false,
        notes: '',
      });

      await onEntryUpdated();
      close();

    } catch (err) {
      alert("Failed to delete game entry. Please try again.")
      console.error("Failed to delete game entry:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] w-full gap-3 font-vt323 p-6">

        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#83c5be] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-[#f4a261] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-[#e76f51] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        <p className="font-press-start text-xs text-[#f4a261] animate-pulse tracking-widest uppercase">
          Loading entry...
        </p>
      </div>
    );
  }


  return (
    <div className="fixed inset-0 z-50 justify-center p-3 md:p-6 bg-[#1c1c28]/80 backdrop-blur-sm font-vt323 overflow-y-auto">

      <div className="pixel-outline-dark-slate max-w-lg w-full mx-auto my-6">
        <form 
          onSubmit={handleSubmit}
          className="pixel-box-lg bg-[#2c2c3e] text-[#f4f1de] w-full max-w-lg p-4 space-y-3.5 my-6 shadow-[6px_6px_0px_0px_#1c1c28]"
        >

          <div className="flex justify-between pb-2">
            <div className="space-y-0.5">
              <span className="font-press-start text-[8px] text-[#83c5be] uppercase tracking-wider">
                [ EDIT CARTRIDGE ENTRY ]
              </span>

              <h2 className="font-press-start text-xs sm:text-sm text-[#f4a261] uppercase leading-snug">
                {game.name}
              </h2>
            </div>

            <button 
              type="button"
              onClick={() => {
                clickSound.play();
                close();
              }}
              className="font-press-start text-[10px] text-[#a8a8b3] hover:text-[#e76f51] p-0.5 cursor-pointer transition-colors"
            >
              [X]
            </button>
          </div>

          {game.background_image && (
            <div className="h-20 w-full overflow-hidden border-2 border-[#3a3a52] bg-[#1c1c28]">
              <img 
                src={game.background_image} 
                alt={game.name}
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-base p-3">
            <div className="flex flex-col space-y-0.5">
              <label htmlFor="status" className="text-[#a8a8b3] text-sm">Status</label>
              <select 
                name="status" 
                id="status" 
                className="bg-[#1c1c28] text-[#f4f1de] p-1.5 focus:outline-none focus:border-none focus:ring-0 border-none cursor-pointer text-base"
                onChange={handleChange}
                value={formData.status || GAME_STATUS.WANT_TO_PLAY}
              >
                <option value={GAME_STATUS.PLAYING}>Playing</option>
                <option value={GAME_STATUS.WANT_TO_PLAY}>Plan to Play</option>
                <option value={GAME_STATUS.COMPLETED}>Completed</option>
                <option value={GAME_STATUS.REPLAYING}>Replaying</option>
                <option value={GAME_STATUS.PAUSED}>Paused</option>
                <option value={GAME_STATUS.DROPPED}>Dropped</option>
              </select>
            </div>

            <div className="flex flex-col space-y-0.5"> 
              <div className="flex justify-between items-center">
                <label htmlFor="score" className="text-[#a8a8b3] text-sm">Score</label>
                <span className="font-press-start text-[10px] text-[#f4a261]">
                  {formData.score ? `${formData.score}/5` : 'N/A'}
                </span>
              </div>
              <input 
                type="range" 
                name="score" 
                id="score" 
                min="0" max="5" 
                value={formData.score} 
                onChange={handleChange} 
                className="accent-[#83c5be] bg-[#1c1c28] cursor-pointer my-auto"
              />
            </div>

            <div className="flex flex-col space-y-0.5">
              <label htmlFor="hours_played" className="text-[#a8a8b3] text-sm">Hours Played</label>
              <input 
                type="number" 
                name="hours_played" 
                id="hours_played" 
                min="0" 
                value={formData.hours_played} 
                onChange={handleChange} 
                className="bg-[#1c1c28] text-[#f4f1de] text-base p-1.5 focus:outline-none"
              />
            </div>

            <div className="flex flex-col space-y-0.5">
              <label htmlFor="total_replays" className="text-[#a8a8b3] text-sm">Total Replays</label>
              <input 
                type="number" 
                name="total_replays" 
                id="total_replays" 
                min="0" 
                value={formData.total_replays} 
                onChange={handleChange} 
                className="bg-[#1c1c28] text-[#f4f1de] text-base p-1.5 focus:outline-none"
              />
            </div>

            <div className="flex flex-col space-y-0.5">
              <label htmlFor="start_date" className="text-[#a8a8b3] text-sm">Start Date</label>
              <input 
                type="date" 
                name="start_date" 
                id="start_date" 
                value={formData.start_date?.split('T')[0] || ''} 
                onChange={handleChange} 
                className="bg-[#1c1c28] text-[#f4f1de] text-base p-1.5 focus:outline-none"
              />
            </div>

            <div className="flex flex-col space-y-0.5">
              <label htmlFor="finish_date" className="text-[#a8a8b3] text-sm">Finish Date</label>
              <input 
                type="date" 
                name="finish_date" 
                id="finish_date" 
                value={formData.finish_date?.split('T')[0] || ''} 
                onChange={handleChange} 
                className="bg-[#1c1c28] text-[#f4f1de] text-base p-1.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#1c1c28] p-2 mt-5 mx-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="favourite" 
              id="favourite" 
              onChange={handleChange} 
              checked={formData.favourite || false}
            />
            <label htmlFor="favourite" className="text-base text-[#f4f1de] cursor-pointer select-none">
              SET AS FAVOURITE
            </label>
          </div>

          <div className="flex flex-col space-y-0.5 px-3 py-1">
            <div className="flex justify-between items-center">
              <label htmlFor="notes" className="text-[#a8a8b3] text-sm">Notes</label>
              <span className="font-press-start text-[8px] text-[#a8a8b3]">
                {(formData.notes?.length || 0)}/500
              </span>
            </div>

            <textarea 
              name="notes" 
              id="notes" 
              rows="3" 
              maxLength={500} 
              value={formData.notes || ''} 
              onChange={handleChange} 
              placeholder="ENTER NOTES..."
              className="bg-[#1c1c28] text-[#f4f1de] p-2 text-base focus:outline-none resize-none break-words"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-5 pt-2 pb-4">
            <button 
              type="submit"
              className="pixel-box-sm font-press-start text-[10px] py-2 w-[17em] bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold cursor-pointer"
              onClick={() => clickSound.play()}
            >
              SAVE ENTRY
            </button>

            <button 
              type="button" 
              onClick={ () => {
                clickSound.play();
                handleDelete();
              }}
              className="pixel-box-sm font-press-start text-[10px] py-2 w-[17em] bg-[#b45252] hover:bg-[#a13a3a] text-[#1c1c28] font-bold cursor-pointer"
            >
              DELETE ENTRY
            </button>



          </div>

        </form>
      </div>

    </div>
  );

}


export function ViewGame() {

  const clickSound = new Audio(clickAudio);

  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const[game, setGame] = useState(null);
  const[loading, setLoading] = useState(true);
  const[popupActive, setPopupActive] = useState(false);

  const [hasEntry, setHasEntry] = useState(false);
  const [formData, setFormData] = useState({
    status: GAME_STATUS.WANT_TO_PLAY,
    score: 0,
    hours_played: 0,
    start_date: '',
    finish_date: '',
    total_replays: 0,
    favourite: false,
    notes: '',
  });

  const handlePopupActive = useCallback(() => {
    setPopupActive((prev) => !prev);
  }, []);

  // fetch game info
  useEffect (() => {
    if (!id) return;

    setLoading(true);

    fetch(`${APIURL}/api/game/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
    })
    .catch((err) => {
      console.error("Error loading game:", err);
      setLoading(false);
    })

  }, [id]);

  // fetch user entry status 
  const checkEntry = useCallback( async () => {
    const userId = getUserIdFromToken();
    if (!userId || !id) return;

    try {
      const res = await fetch (`${APIURL}/api/fetch-entry?userId=${userId}&gameId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        const entry = result.data;

        if (result.data) { 
          setHasEntry(true); 

          setFormData({
            status: entry.status || GAME_STATUS.WANT_TO_PLAY,
            score: entry.score ?? 0,
            hours_played: entry.hours_played ?? 0,
            start_date: entry.start_date || '',
            finish_date: entry.finish_date || '',
            total_replays: entry.total_replays || 0,
            favourite: Boolean(entry.favourite) || false,
            notes: entry.notes || '',
          });

        }
        else { setHasEntry(false); }
      }
    } catch (err) {
        console.error("Error checking user entry status:", err)
    }
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && id) {
      checkEntry();
    }
  }, [isAuthenticated, id, checkEntry]);

  
  if (loading) {
    return (
      <div>
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-[200px] w-full gap-3 font-vt323 p-6">

          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#83c5be] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-[#f4a261] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-[#e76f51] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <p className="font-press-start text-xs text-[#f4a261] animate-pulse tracking-widest uppercase">
            Loading Game...
          </p>
        </div>

      </div>

    );
  }

  if (!game) {
  return (
    <div className="w-full min-h-screen bg-[#0d0e15] text-[#f4f1de] font-vt323">
      <Navbar />
      
      <div className="max-w-4xl w-full mx-auto px-3 sm:px-4 py-8 space-y-3 flex flex-col items-center">
        <h2 className="text-[#e76f51] text-2xl">Failed to load game.</h2>
        
        <div>
          <a
            href="/discover"
            className="inline-block pixel-box-sm font-press-start text-[10px] py-3 px-6 bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold"
          >
            CONTINUE BROWSING
          </a>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="w-full min-h-screen text-[#f4f1de] flex flex-col font-vt323">
      <Navbar />

        {/* Header img */}
        <div className="relative overflow-hidden w-full h-48 border-b-2 border-[#2c2c3e]">
          <img 
            src={game.background_image || `../${game.background_image}`}
            alt={game.name}
            className="h-full w-full blur-md object-cover object-center opacity-30 scale-105 z-0 absolute inset-0"
          />

          {/* <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1c1c28] via-[#1c1c28]/60 to-transparent" /> */}

          <div className="max-w-4xl mx-auto h-full relative flex items-end pb-4 px-3 sm:px-4 z-10">
            <h2 className="text-[#f4f1de] font-press-start font-bold text-lg sm:text-2xl uppercase drop-shadow-[2px_2px_0px_#1c1c28] tracking-wider">
              {game.name}
            </h2>
          </div>
        </div>

        <div className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            <div className="lg:col-span-2 space-y-4">
              {/* Game img */}
              <div className="pixel-outline-slate">
                <img 
                  src={game.background_image || `../${game.background_image}`}
                  alt={game.name}
                  className="pixel-box"
                />
              </div>

              {/* Game desc */}
              <article className="pixel-box bg-[#2c2c3e]/50 p-4 space-y-2.5">
                <h3 className="font-press-start text-[#f4a261] text-xs uppercase tracking-wider border-b-2 border-[#3a3a52] pb-2.5">
                  About the game
                </h3>

                <p className="text-[#f4f1de] text-base leading-relaxed whitespace-pre-line">
                  {game.description_raw?.replace(/(\r?\n){2,}/g, "\n\n") || "No description available."}
                </p>
              </article>
            </div>

            <aside className="lg:col-span-1 space-y-4">

              {/* Scores */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-[#2c2c3e] p-2.5 text-center pixel-box-sm">
                  <p className="text-[#a8a8b3] text-[10px] font-press-start">Metascore</p>
                  <p className="text-[#83c5be] text-xl font-bold mt-0.5">{game.metacritic || 'N/A'}</p>
                </div>

                <div className="bg-[#2c2c3e] p-2.5 text-center pixel-box-sm">
                  <p className="text-[#a8a8b3] text-[10px] font-press-start">User rating</p>
                  <p className="text-[#83c5be] text-xl font-bold mt-0.5">{game.rating || 'N/A'}</p>
                </div>
              </div>

              {/* Game info */}
              <div className="bg-[#2c2c3e] p-4 space-y-2.5 pixel-box-sm">
                <h3 className="font-press-start text-[10px] text-[#f4a261] uppercase tracking-wider border-b-2 border-[#3a3a52] pb-1.5">
                  Information
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center border-b-2 border-[#3a3a52]/50 pb-1.5">
                    <span className="text-[#a8a8b3]">Release Date</span>
                    <span className="text-[#f4f1de]">
                      {game.released 
                        ? new Date(game.released).toLocaleDateString('en-UK', {month:'numeric', day:'numeric', year:'numeric'})
                        : "N/A"
                      }
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b-2 border-[#3a3a52]/50 pb-1.5">
                    <span className="text-[#a8a8b3]">Avg Playtime</span>
                    <span className="text-[#f4f1de]">
                      {game.playtime ? `${game.playtime} Hours`: "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b-2 border-[#3a3a52]/50 pb-1.5">
                    <span className="text-[#a8a8b3]">Genres</span>
                    <span className="text-[#f4f1de]">
                      {game.genres?.map((g) => g.name).join(", ") || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between pb-1">
                    <span className="text-[#a8a8b3]">Platforms</span>
                    <div className="text-end">
                      {game.platforms?.map((p) => <p key={p.platform.id || p.platform.name}>{p.platform.name}</p>) || "N/A"}
                    </div>
                  </div>

                </div>

              </div>

              {/* Entry info */}
              {isAuthenticated &&
                <div className="bg-[#2c2c3e] pixel-box-sm pt-3 p-4 font-vt323">
                  <div className="flex items-center justify-between pb-1.5">
                    <span className="font-press-start text-[10px] text-[#83c5be] uppercase tracking-wider py-1">
                      Cartridge status
                    </span>

                    <span 
                      className="text-xs pixel-box-sm text-[#f4f1de] px-2 py-0.5 mb-1 mt-0.5"
                      style={{backgroundColor: STATUS_COLOURS_LOW[formData?.status] || STATUS_COLOURS_LOW.default}}
                    >
                      {hasEntry ? STATUS_MAP[formData.status] : "N/A"}
                    </span>
                  </div>

                  <div className="h-[0.15em] w-full bg-[#3a3a52] mb-2" />

                  <div className="flex justify-between text-sm border-b-2 border-[#3a3a52]/50 pb-1.5">
                    <span className="text-[#a8a8b3]">Your Rating:</span>
                    <span className="text-[#d3a068]">{STAR_MAP[formData.score]}</span>
                  </div>

                  <div className="flex justify-between text-sm border-b-2 border-[#3a3a52]/50 py-1.5">
                    <span className="text-[#a8a8b3]">Hours Played</span>
                    <span className="text-[#f4f1de]">{formData.hours_played}</span>
                  </div>

                  <div className="flex justify-between text-sm border-b-2 border-[#3a3a52]/50 py-1.5">
                    <span className="text-[#a8a8b3]">Date Started</span>
                    <span className="text-[#f4f1de]">
                      {formData.start_date 
                        ? new Date(formData.start_date).toLocaleDateString('en-UK', {month:'numeric', day:'numeric', year:'numeric'})
                        : "N/A"
                      }
                    </span>
                  </div>

                  <div className="flex justify-between text-sm border-b-2 border-[#3a3a52]/50 py-1.5">
                    <span className="text-[#a8a8b3]">Date Completed</span>
                    <span className="text-[#f4f1de]">
                      {formData.finish_date 
                        ? new Date(formData.finish_date).toLocaleDateString('en-UK', {month:'numeric', day:'numeric', year:'numeric'})
                        : "N/A"
                      }
                    </span>
                  </div>

                  <div className="flex justify-between text-sm border-b-2 border-[#3a3a52]/50 py-1.5">
                    <span className="text-[#a8a8b3]">Total Replays</span>
                    <span className="text-[#f4f1de]">{formData.total_replays}</span>
                  </div>

                  <div className="flex flex-col text-sm pt-1.5">
                    <p className="text-[#a8a8b3]">Notes</p>
                    <p className="text-[#f4f1de] break-words line-clamp-3">{formData.notes ? formData.notes : "No notes added."}</p>
                  </div>
                </div>
              }

              {/* Entry button */}
              {isAuthenticated && 
                <div className="flex items-center justify-center">
                  <button 
                    className="pixel-box-sm font-press-start text-[0.6rem] py-2 px-3 lg:w-full sm:w-[40em] md:w-[40em] bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
                    onClick={() => {
                      setPopupActive(true);
                      clickSound.play();
                    }}
                  >
                    {hasEntry ? 'Edit entry' : 'Add to library'}
                  </button>
                </div>
              }

            </aside>

          </div>

        </div>

        <Footer />

        {popupActive && <ViewEntry game={game} close={handlePopupActive} onEntryUpdated={checkEntry} />}

    </div>
  );

}