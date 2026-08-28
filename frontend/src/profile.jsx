import { Navbar } from './components/navbar.jsx';
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { GameCard } from './components/gamecard.jsx'
import { GameRow } from './components/gamerow.jsx'
import { GameGrid } from './components/gamegrid.jsx'
import { useAuth } from '../../services/authContext.jsx';
import { getUserIdFromToken } from '../../services/authServices.js';
import { GAME_STATUS } from '../../services/constants.js';


function ProfileCard ( { user, onAvatarUpdate }) {

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // update avatar logic
  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  const onFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    // format data
    const formData = new FormData();
		formData.append("avatar", selectedFile);

    setUploading(true);

    // post data
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/profile/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`},
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text(); 
        console.error("Server Error:", errorText);
        return;
      }

      const updatedUser = await res.json();

      if (onAvatarUpdate) {
        onAvatarUpdate(updatedUser);
      }

      setSelectedFile(null);

    } catch (err) {
      alert('Failed to upload avatar. Please try again.');
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // Avatar + edit -> similar layout to view game
  // Username, date joined
  // bio

  return (
    <div className="text-white">

      {/* User avatar */}
      <div>
        {user.avatar && (
          <img
            src={user.avatar.startsWith('https') ? user.avatar : `http://localhost:5000${user.avatar}?t=${Date.now()}`}
            alt="Avatar"
            className="pixel-box m-1 w-[18em] h-[18em] object-cover"
          />
        )}
      </div>

      {/* Editing user avatar */}
      <div className="flex flex-col gap-2 items-center">
        <input type="file" accept="image/*" className="hidden" id="avatar-upload" onChange={onFileChange} />

        <label 
          htmlFor="avatar-upload" 
          className="pixel-box w-full cursor-pointer bg-slate-800 hover:bg-slate-700 font-vt323 px-3 py-2 text-center text-slate-300">
            {selectedFile ? "Change File" : "Choose Image"}
        </label>

        <button 
          onClick={onFileUpload} 
          disabled={uploading}
          className="pixel-box w-full bg-indigo-600 hover:bg-indigo-500 px-3 py-2 disabled:bg-slate-800 disabled:opacity-50 text-white font-vt323">
            {uploading ? "Uploading..." : "Upload image"}
        </button>
        
        <p className="text-xl font-vt323 text-slate-400 truncate text-overflow: ellipsis">
          {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
        </p>
      </div>

      {/* Username, bio, etc. */}
      <div className="ml-8 font-vt323 text-2xl text-slate-400 py-5 flex flex-col gap-6">
        <div>
          <p className="font-press-start">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</p>
          <p>{user.bio}</p>
        </div>
      
        <div className="text-slate-600">
          <p>User ID: {user._id}</p>
          <p>Joined {new Date(user.date_joined).toLocaleDateString('en-UK', {month:'long', day:'numeric', year:'numeric'})}</p>
        </div>
      </div>

    </div>
  );
}


function StatsProgressBar ({ counts, totalGames }) {

  if (!totalGames || totalGames === 0) {
    return (
      <div>
        <span className="text-xs text-slate-500 font-vt323">No games in library</span>
      </div>
    );
  }

  const statusColors = {
    [GAME_STATUS.PLAYING]: 'bg-emerald-500',
    [GAME_STATUS.WANT_TO_PLAY]: 'bg-sky-500',
    [GAME_STATUS.COMPLETED]: 'bg-indigo-500',
    [GAME_STATUS.REPLAYING]: 'bg-amber-500',
    [GAME_STATUS.PAUSED]: 'bg-orange-500',
    [GAME_STATUS.DROPPED]: 'bg-rose-500',
  };

  return (

    <div>
      <div className="w-full h-6 overflow-hidden flex">
        {Object.entries(counts).map(([status, count]) => {
          if (count === 0) return null;
          const percentage = (count / totalGames) * 100;

          return (
            <div 
              key={status}
              style={{ width: `${percentage}%`}}
              className={`${statusColors[status] || 'bg-slate-600'}`}
              title={`${status}: ${count} (${Math.round(percentage)}%)`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap">
        {Object.entries(counts).map(([status, count]) => {
          if (count === 0) return null;
          const percentage = Math.round((count / totalGames) * 100);

          return (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 inline-block ${statusColors[status]}`}/>
              <span>{status}: {count} ({percentage}%)</span>
            </div>
          );
        })}
      </div>




    </div>
  );
}


function Stats ( { userGames } ) {

  const totalGames = userGames.length;
  let totalHours = 0;

  let genreCounts = {};
  let statusCounts = {
    [GAME_STATUS.PLAYING]: 0,
    [GAME_STATUS.WANT_TO_PLAY]: 0,
    [GAME_STATUS.COMPLETED]: 0,
    [GAME_STATUS.REPLAYING]: 0,
    [GAME_STATUS.PAUSED]: 0,
    [GAME_STATUS.DROPPED]: 0,
  }

  // get top genre
  userGames.forEach((game) => {
    if (Array.isArray(game?.genres)) {
      game.genres.forEach((g) => {
        if (g) { genreCounts[g] = (genreCounts[g] || 0) + 1; }
      });
    }
  });

  const top3Genres = Object.entries(genreCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)               
  .map(([genre]) => genre);   

  // get status counts
  userGames.forEach((game) => {
    if (game.status in statusCounts) { 
      statusCounts[game.status] += 1; 
    }
    totalHours += game.hours_played;
  });

  // const gamesPlaying = userGames.filter((g) => g.status === GAME_STATUS.PLAYING).length;
  // const gamesPlanning = userGames.filter((g) => g.status === GAME_STATUS.WANT_TO_PLAY).length;
  // const gamesCompleted = userGames.filter((g) => g.status === GAME_STATUS.COMPLETED).length;
  // const gamesReplaying = userGames.filter((g) => g.status === GAME_STATUS.REPLAYING).length;
  // const gamesPaused = userGames.filter((g) => g.status === GAME_STATUS.PAUSED).length;
  // const gamesDropped = userGames.filter((g) => g.status === GAME_STATUS.DROPPED).length;

  return (
    <div className="text-white">
      
      <div>
        <p>Total games: {totalGames}</p>
      </div>

      <div>
        <p>Total hours: {totalHours}</p>
      </div>

      <div>
        <p>Top genres: {top3Genres.length === 0 ? "None" : top3Genres.join(', ')}</p>
      </div>

      <div>
        <p>Games playing: {statusCounts[GAME_STATUS.PLAYING]}</p>
        <p>Games planning: {statusCounts[GAME_STATUS.WANT_TO_PLAY]}</p>
        <p>Games completed: {statusCounts[GAME_STATUS.COMPLETED]}</p>
        <p>Games replaying: {statusCounts[GAME_STATUS.REPLAYING]}</p>
        <p>Games paused: {statusCounts[GAME_STATUS.PAUSED]}</p>
        <p>Games dropped: {statusCounts[GAME_STATUS.DROPPED]}</p>

        <StatsProgressBar counts={statusCounts} totalGames={totalGames} />
 
      </div>


    </div>
  );
}


function Library ({ userGames }) {

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (e) => {
    setFilterStatus(e.target.value);
  } 

  const displayedGames = userGames.filter((game) => {
    const matchesStatus = filterStatus === 'all' || game.status === filterStatus;

    const title = (game.game_title || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || title.includes(query);

    return matchesStatus && matchesSearch;
  })

  const favouriteGames = userGames.filter((game) => game.favourite === true );


  return (
    <div>
      <div>
        <select
          name="filter" 
          id="filter" 
          className="text-black bg-white" 
          onChange={handleSelect}
          value={filterStatus}
        >
          <option value={'all'}>All</option>
          <option value={GAME_STATUS.PLAYING}>Playing</option>
          <option value={GAME_STATUS.WANT_TO_PLAY}>Plan to Play</option>
          <option value={GAME_STATUS.COMPLETED}>Completed</option>
          <option value={GAME_STATUS.REPLAYING}>Replaying</option>
          <option value={GAME_STATUS.PAUSED}>Paused</option>
          <option value={GAME_STATUS.DROPPED}>Dropped</option>
        </select>

        <input 
          type='text' 
          placeholder="Search games..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-black bg-white font-vt323"
        />

        {searchQuery && 
              <button
                onClick={() => setSearchQuery('')}
                className="pixel-box font-press-start text-xs py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition duration-100 active:scale-[0.98]"
              >
                CLEAR
              </button>
            }
      </div>

      <div>
        <GameRow title={"Favourite Games"} games={favouriteGames}/>
      </div>

      <div>
        <GameGrid title={`${filterStatus} games`} games={displayedGames} cols='5' />
      </div>

    </div>
  );
}


export function Profile () {

  const token = localStorage.getItem('token');
  const[user, setUser] = useState(null);
  const[loading, setLoading] = useState(true)
  const [userGames, setUserGames] = useState([]);

  const handleAvatarUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // fetch profile info
  useEffect(() => {
    if (!token) {
      console.error("No token found in localStorage!");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setUser(data);
    })
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));

  }, [token]);

  // fetch library
  useEffect(() => {
    const fetchGames = async () => {
      const userId = getUserIdFromToken();
      const token = localStorage.getItem('token');
      
      if (!token || !userId) {
        console.warn("No token or userId found in storage.");
        setLoading(false);
        return;
      }

      try {
        const resGames = await fetch(`http://localhost:5000/fetch-entry?userId=${userId}`, { 
          headers: { 'Authorization': `Bearer ${token}`}
        });

        if (resGames.ok) {
          const resultGames = await resGames.json();
          setUserGames(resultGames.data || resultGames || []);
        } else {
          console.error("Games fetch failed with status:", resGames.status);
        }
      } catch (err) {
        console.error("Error fetching user shelf:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();

  }, []);

  // loading render
  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading profile...</p>
      </div>
    );
  }

  // Failed render
  if (!user) {
    return (
      <div>
        <Navbar />
        <p>Failed to load profile. Please login or try again.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div>
        <ProfileCard user={user} onAvatarUpdate={handleAvatarUpdate}/>
      </div>

      <div>
        <Stats userGames={userGames} />
      </div>

      <div>
        <Library userGames={userGames} />
      </div>

    </div>
  );
}
