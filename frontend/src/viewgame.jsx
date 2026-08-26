import { Navbar } from './components/navbar.jsx';
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth, AuthProvider } from '../../services/authContext.jsx';
import { GAME_STATUS } from '../../services/constants.js';
import { getUserIdFromToken } from '../../services/authServices.js'


function ViewEntry({ game, close, onEntryUpdated }) {

  // const [status, setStatus] = useState("");
  // const [score, setScore] = useState(0);
  // const [hours, setHours] = useState(0);
  // const [startDate, setStartDate] = useState('');
  // const [finishDate, setFinishDate] = useState('');
  // const [replays, setReplays] = useState(0);
  // const [favourite, setFavourite] = useState(false);
  // const [notes, setNotes] = useState("");


  const [formData, setFormData] = useState({
    status: '',
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
        const res = await fetch(`http://localhost:5000/fetch-entry?userId=${userId}&gameId=${game.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!res.ok) {
          throw new Error('Error fetching game entry. Server status:', res.status)
        }

        const data = await res.json();
        const entry = data.data;

        if (entry) {
          setFormData({
            status: entry.status || 'plan_to_play',
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
      const res = await fetch('http://localhost:5000/save-entry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameId: game.id,
          gameTitle: game.name,
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
      const res = await fetch(`http://localhost:5000/delete-entry`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          gameId: game.id,
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
      <div className="text-white font-vt323 text-2xl fixed inset-0  z-50 overflow-y-auto bg-black/30 backdrop-blur-sm p-15 md:p-25">
        <div className="pixel-box-lg flex flex-col gap-3 bg-slate-800 p-5 md:p-10">
          <p className="font-press-start">Loading entry...</p>

        </div>
      </div>
    );
  }


  return (
    <div className="text-white font-vt323 text-2xl fixed inset-0  z-50 overflow-y-auto bg-black/30 backdrop-blur-sm p-15 md:p-25">

      <form 
        onSubmit={handleSubmit}
        className="pixel-box-lg flex flex-col gap-3 bg-slate-800 p-5 md:p-10"
      >
        <div>
          <div className="flex flex-row">
            <p className="font-press-start">{game.name}</p>
            <button className="text-4xl" onClick={close}>X</button>
          </div>
          <img src={game.background_image}/>
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select 
            name="status" 
            id="status" 
            className="text-black" 
            onChange={handleChange}
            value={formData.status || 'plan_to_play'}
          >
            <option value={GAME_STATUS.PLAYING}>Playing</option>
            <option value={GAME_STATUS.WANT_TO_PLAY}>Plan to Play</option>
            <option value={GAME_STATUS.COMPLETED}>Completed</option>
            <option value={GAME_STATUS.REPLAYING}>Replaying</option>
            <option value={GAME_STATUS.PAUSED}>Paused</option>
            <option value={GAME_STATUS.DROPPED}>Dropped</option>
          </select>
        </div>

        <div>
          <label htmlFor="score">Score</label>
          <input type="range" name="score" id="score" min="0" max="10" value={formData.score} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="hours_played">Hours Played</label>
          <input type="number" name="hours_played" id="hours_played" min="0" value={formData.hours_played} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="started_at">Start Date</label>
          <input type="date" name="start_date" id="start_date" value={formData.start_date?.split('T')[0] || ''} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="finished_at">Finish Date</label>
          <input type="date" name="finish_date" id="finish_date" value={formData.finish_date?.split('T')[0] || ''} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="total_replays">Total Replays</label>
          <input type="number" name="total_replays" id="total_replays" min="0" value={formData.total_replays} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="favourite">Set as Favourite</label>
          {/* <button onClick={toggleFavourite} name="favourite" id="favourite">{`<3`}</button> */}
          <input type="checkbox" name="favourite" id="favourite" onChange={handleChange} checked={formData.favourite}/>
        </div>

        <div className="flex flex-col">
          <label htmlFor="notes">Notes</label>
          <textarea name="notes" id="notes" rows="4" cols="50" value={formData.notes} onChange={handleChange} />
        </div>

        <div className="flex gap-5">
          <button type="submit">Save Entry</button>
          <button type="button" onClick={handleDelete}>Delete Entry</button>
        </div>

      </form>

    </div>
  );

}


export function ViewGame() {

  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  const[game, setGame] = useState(location.state?.game || null);
  const[loading, setLoading] = useState(!game);
  const[popupActive, setPopupActive] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  const handlePopupActive = useCallback(() => {
    setPopupActive(!popupActive);
  }, [popupActive]);

  // fetch game info
  useEffect (() => {
    if (!game && id) {
      fetch(`http://localhost:5000/api/games/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setGame(data);
          setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading game:", err);
        setLoading(false);
      })
    }
  }, [id, game]);

  // fetch game status 
  const checkEntry = useCallback( async () => {
    const userId = getUserIdFromToken();
    if (!userId|| !game?.id) return;

    try {
      const res = await fetch (`http://localhost:5000/fetch-entry?userId=${userId}&gameId=${game.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        if (result.data) { setHasEntry(true); }
        else { setHasEntry(false); }
      }
    } catch (err) {
        console.error("Error checking user entry status:", err)
    }
  }, [game?.id]);

  useEffect(() => {
    if (isAuthenticated && game?.id) {
      checkEntry();
    }
  }, [isAuthenticated, game?.id, checkEntry]);

  

  if (loading === true) {
    return (
      <div className="bg-[#0f1216] text-white">
        <Navbar />
        <h2 className="text-white p-10 font-vt323 text-2xl">Loading game...</h2>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="bg-[#0f1216] text-white">
        <Navbar />
        <h2 className="text-white p-10 font-vt323 text-2xl">Failed to load game.</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1216]">
      <Navbar />

        <div className="relative overflow-hidden w-full h-72">
          <img 
            src={game.background_image || `../${game.background_image}`}
            className="blur-md object-cover object-center opacity-30 scale-105"
          />

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f1216] via-[#0f1216]/60 to-transparent" />

          <div className="">
            <h2 className="absolute bottom-6 text-white font-press-start font-bold text-3xl uppercase drop-shadow-md px-10">{game.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            <div>
              <img 
                src={game.background_image || `../${game.background_image}`}
                className="pixel-box-lg scale-93"
              />
            </div>

            <div>
              {isAuthenticated && 
                <button 
                  className="pixel-box font-press-start text-xs py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition duration-100 active:scale-[0.98]"
                  onClick={() => setPopupActive(true)}
                >
                  {hasEntry ? 'Edit entry' : 'Add to library'}
                </button>}
            </div>

            <article className="mt-6">
              <h3 className="font-vt323 text-white uppercase text-3xl">
                About the game
              </h3>

              <hr className="bg-red-500" />

              <p className="text-white font-vt323 text-xl">
                {game.description_raw || "No description available."}
              </p>
            </article>

            <aside>
              <div>
                <div>
                  <p className="text-white">Metascore</p>
                  <p className="text-white">{game.metacritic || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-white">User rating</p>
                  <p className="text-white">{game.rating || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3>
                  Information
                </h3>

                <div>
                  <div>
                    <p>Release Date</p>
                    <p className="text-white">{game.released || "N/A"}</p>
                  </div>

                  <div>
                    <p>Avg Playtime</p>
                    <p className="text-white">{game.playtime || "N/A"}</p>
                  </div>

                  <div>
                    <p>Genres</p>
                    {/* <p className="text-white">{game.genres || "N/A"}</p> */}
                  </div>

                  <div>
                    <p>Platforms</p>
                    {/* <p className="text-white">{game.platforms || "N/A"}</p> */}
                  </div>
                </div>

              </div>
            </aside>

          </div>
        </div>

        {popupActive && <ViewEntry game={game} close={handlePopupActive} onEntryUpdated={checkEntry} />}

    </div>
  );

}