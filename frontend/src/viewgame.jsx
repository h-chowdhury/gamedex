import { Navbar } from './components/navbar.jsx';
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth, AuthProvider } from '../../services/authContext.jsx';
import { GAME_STATUS } from '../../services/constants.js';


function ViewEntry({ game, close }) {

  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);
  const [hours, setHours] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [replays, setReplays] = useState(0);
  const [favourite, setFavourite] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <div className="bg-white">

      <div>
        <p>{game.name}</p>
        <img src={game.background_image}/>
      </div>

      <div>
        <label for="status">Status</label>
        <select name="status" id="status">
          <option value={GAME_STATUS.WANT_TO_PLAY}>Plan to Play</option>
          <option value={GAME_STATUS.PLAYING}>Playing</option>
          <option value={GAME_STATUS.COMPLETED}>Completed</option>
          <option value={GAME_STATUS.DROPPED}>Dropped</option>
        </select>
      </div>

      <div>
        <label for="score">Score</label>
        <input type="range" name="score" id="score" min="0" max="10" />
      </div>

      <div>
        <label for="hours_played">Hours Played</label>
        <input type="number" name="hours_played" id="hours_played" />
      </div>

      <div>
        <label for="started_at">Start Date</label>
        <input type="date" name="started_at" id="started_at" />
      </div>

      <div>
        <label for="finished_at">Finish Date</label>
        <input type="date" name="finished_at" id="finished_at" />
      </div>

      <div>
        <label for="total_replays">Total Replays</label>
        <input type="number" name="total_replays" id="total_replays" />
      </div>

      <div>
        <label for="favourite_status">Set as Favourite</label>
        <button>{`<3`}</button>
      </div>

      <div>
        <label for="notes">Notes</label>
        <textarea name="notes" id="notes" rows="8" cols="50" />
      </div>

      <div>
        <button
          onClick={close}
        >
          Close
        </button>

        <button>Save Entry</button>
        <button>Delete Entry</button>
      </div>

    </div>
  );

}


export function ViewGame() {

  const { id } = useParams();
  const location = useLocation();
  const[game, setGame] = useState(location.state?.game || null);
  const[loading, setLoading] = useState(!game);
  const[popupActive, setPopupActive] = useState(false);
  const {login, logout, isAuthenticated } = useAuth();

  const handlePopupActive = useCallback(() => {
    setPopupActive(!popupActive);
  }, [popupActive]);

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
                  Edit entry
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

        {popupActive && <ViewEntry game={game} close={handlePopupActive} />}

    </div>
  );

}