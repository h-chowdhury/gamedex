import { Navbar } from './components/navbar.jsx';
import { Footer } from './components/footer.jsx';
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { GameCard } from './components/gamecard.jsx'
import { GameRow } from './components/gamerow.jsx'
import { GameGrid } from './components/gamegrid.jsx'
import { useAuth } from '../../services/authContext.jsx';
import { getUserIdFromToken } from '../../services/authServices.js';
import { GAME_STATUS } from '../../services/constants.js';


function ProfileCard ( { token, user, onProfileUpdate }) {

  // update profile logic
  const [isEditing, setIsEditing] = useState(false);

  const [bio, setBio] = useState(user?.bio || "")
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
  };

  const saveChanges = async (e) => {
    e.preventDefault()

    const formData = new FormData();
    formData.append('bio', bio);

    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      const response = await fetch('http://localhost:5000/profile/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      onProfileUpdate(updatedUser);
      setIsEditing(false);

    } catch (err) {
      alert('Failed to save changes. Please try again.');
      console.error("Upload error:", err);
    }
  }

  const cancelChanges = () => {
    setBio(user?.bio || "");
    setAvatar(null);
    setPreviewUrl(null);
    setIsEditing(false);
  }

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const avatarSrc = previewUrl 
    ? previewUrl
    : user?.avatar?.startsWith("https")
      ? user.avatar
      : `http://localhost:5000${user?.avatar}`


  return (
    <div className="text-white">

      <div className="pixel-box group relative m-1 w-[18em] h-[18em]">
        {user?.avatar && (
          <img
            src={avatarSrc}
            alt="Avatar"
            className="pixel-box m-1 w-[18em] h-[18em] object-cover"
          />
        )}

        {isEditing &&
          ( <>
              <input
                type="file" 
                accept="image/*" 
                className="hidden"
                id="avatar-upload" 
                onChange={onFileChange} 
              />

              <label 
                htmlFor="avatar-upload" 
                className="absolute w-[18em] h-[18em] inset-0 bg-slate-900/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center cursor-pointer font-vt323 text-slate-200"
              >
                <span className="text-3xl mb-1">📷</span>
                <span className="text-2xl text-center">
                  Change Avatar
                </span>
              </label>
            </>
          )
        }
      </div>


      {/* Username, bio, etc. */}
      <div className="ml-8 font-vt323 text-2xl text-slate-400 py-5 flex flex-col gap-6">
 
        <p className="font-press-start">{user.username?.charAt(0).toUpperCase() + user.username?.slice(1)}</p>

        {isEditing
          ? (
            <form onSubmit={saveChanges}>
              {/* <input 
                type="text"
                placeholder="Enter new username."
                className="bg-slate-800 pixel-box px-4 py-1"
                value={username.charAt(0).toUpperCase() + username.slice(1)}
                onChange={(e) => setUsername(e.target.value)}
              /> */}

              <textarea
                placeholder="Write something about yourself!"
                className="bg-slate-800 pixel-box px-4 py-3"
                rows="4" cols="50" 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              <button 
                type="submit"
                className="pixel-box font-press-start text-xs py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition duration-100 active:scale-[0.98]"
              >
                Save Changes
              </button>

              <button 
                type="button"
                className="pixel-box font-press-start text-xs py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md transition duration-100 active:scale-[0.98]"
                onClick={cancelChanges}
              >
                Cancel Changes
              </button>
            </form>
          )
          : (
            <div>
              <p>{ user.bio.trim().length > 0 ? user.bio : "No bio set."}</p>
              <button 
                type="button"
                className="pixel-box font-press-start text-xs py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition duration-100 active:scale-[0.98]"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )
        }
      
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

  const handleProfileUpdate = (updatedUser) => {
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
        <ProfileCard token={token} user={user} onProfileUpdate={handleProfileUpdate}/>
      </div>

      <div>
        <Stats userGames={userGames} />
      </div>

      <div>
        <Library userGames={userGames} />
      </div>

      <Footer />

    </div>
  );
}
