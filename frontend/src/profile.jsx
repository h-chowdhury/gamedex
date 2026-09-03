import { Navbar } from './components/navbar.jsx';
import { Footer } from './components/footer.jsx';
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { GameCard } from './components/gamecard.jsx'
import { GameRow } from './components/gamerow.jsx'
import { GameGrid } from './components/gamegrid.jsx'
import { useAuth } from '../../services/authContext.jsx';
import { getUserIdFromToken } from '../../services/authServices.js';
import { GAME_STATUS, STATUS_MAP, STATUS_COLOURS } from '../../services/constants.js';
import clickAudio from "/audio/click.mp3";


function ProfileCard ( { token, user, onProfileUpdate }) {

  const clickSound = new Audio(clickAudio);

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
    <div className="bg-[#2c2c3e] border-b-4 border-[#1c1c28]">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-stretch p-6 pixel-box-lg text-[#f4f1de]">

        {/* Avatar block */}
        <div className="pixel-outline-slate group relative flex-shrink-0 w-[18em] h-[18em] bg-[#2c2c3e]">
        
          {user?.avatar ? (
            <div className="pixel-outline-teal">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover pixel-box"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-press-start text-xs text-[#a8a8b3]">
              {'[No Avatar]'}
            </div>
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
                  className="absolute inset-0 bg-[#1c1c28]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center cursor-pointer font-vt323 text-[#f4f1de]"
                >
                  <span className="text-4xl mb-1">📷</span>
                  <span className="text-2xl text-center text-[#83c5be]">
                    Change Avatar
                  </span>
                </label>
              </>
            )
          }
        </div>


        {/* Username, bio, etc. */}
        <div className="font-vt323 text-2xl text-[#a8a8b3] flex-1 flex flex-col gap-5 w-full">
  
          <p className="font-press-start text-xl md:text-2xl text-[#f4a261] tracking-wide drop-shadow-[2px_2px_0px_#1c1c28] mt-4">
            {/* {user.username?.charAt(0).toUpperCase() + user.username?.slice(1)} */}
            {user.username?.toUpperCase()}
          </p>

          {isEditing
            ? (
              <form onSubmit={saveChanges} className="flex flex-col gap-4">

                <textarea
                  placeholder="Write something about yourself!"
                  className="bg-[#1c1c28] text-[#f4f1de] placeholder-[#a8a8b3]/60 pixel-box px-4 py-3 font-vt323 text-xl focus:outline-none resize-none"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={200}
                />

                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={() => clickSound.play()}
                    type="submit"
                    className="pixel-box font-press-start text-xs py-2.5 px-4 bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
                  >
                    Save Changes
                  </button>

                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      clickSound.play();
                    }}
                    type="button"
                    className="pixel-box font-press-start text-xs py-2.5 px-4 bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
                  >
                    Cancel Changes
                  </button>

                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="pixel-box text-[#f4f1de] text-xl text-sm/3.5 break-words line-clamp-3 bg-[#1c1c28] p-4 border-[#2c2c3e]">
                  {user.bio.trim().length > 0 ? user.bio : "No bio set."}
                </p>

                <button 
                  type="button"
                  className="pixel-box font-press-start text-xs py-2.5 px-4 bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
                  onClick={() => {
                    clickSound.play();
                    setIsEditing(true);
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )
          }

          {/* border-t-4 border-[#2c2c3e] */}
          <div className="text-xl font-vt323 text-[#a8a8b3]/80 flex flex-row mt-auto justify-between">
            <p>Joined {new Date(user.date_joined).toLocaleDateString('en-UK', {month:'long', day:'numeric', year:'numeric'})}</p>
            <p>ID: <span className="text-xl">{user._id}</span> </p>
          </div>
        </div>

      </div>
    </div>
  );
}


function StatsProgressBar ({ counts, totalGames }) {

  if (!totalGames || totalGames === 0) {
    return (
    <div className="bg-[#2c2c3e]/30 p-4 text-center">
      <span className="font-vt323 text-xl text-[#a8a8b3]">
        [ No games in library ]
      </span>
    </div>
  );
  }

  return (

    <div className="space-y-3 font-vt323">
      <div className="w-full h-5 flex overflow-hidden p-0.5">
        {Object.entries(counts).map(([status, count]) => {
          if (count === 0) return null;
          const percentage = (count / totalGames) * 100;

          return (
            <div 
              key={status}
              style={{ width: `${percentage}%`}}
              className={`${STATUS_COLOURS[status] || 'bg-[#a8a8b3]'} transition-all duration-300`}
              title={`${STATUS_MAP[status]}: ${count} (${Math.round(percentage)}%)`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-lg text-[#f4f1de]">
        {Object.entries(counts).map(([status, count]) => {
          if (count === 0) return null;
          const percentage = Math.round((count / totalGames) * 100);

          return (
            <div key={status} className="flex items-center gap-2">
              <span className={`w-3 h-3 inline-block ${STATUS_COLOURS[status] || 'bg-[#a8a8b3]'}`}/>
              <span className="">{STATUS_MAP[status].toUpperCase()}</span>: {' '}
              <span className="text-[#f4a261]">{count}</span> {' '}
              <span className="text-[#a8a8b3] text-base">({percentage}%)</span>
              {/* <span>{statusMap[status]}: {count} ({percentage}%)</span> */}
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

  return (
  <div className="pixel-box-lg bg-[#1c1c28] p-6 text-[#f4f1de] mt-6 space-y-6 max-w-5xl mx-auto">
    
    <div className="flex items-center gap-3 border-b-4 border-[#2c2c3e] pb-3">
      <div className="w-2.5 h-2.5 bg-[#83c5be]" />
      <h2 className="text-[#f4a261] font-press-start text-sm uppercase tracking-wider">
        Player Statistics
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Total Games */}
      <div className="bg-[#2c2c3e]/50 p-4 text-center">
        <p className="font-press-start text-xs text-[#83c5be] uppercase mb-1">
          Total Games
        </p>
        <p className="font-vt323 text-4xl text-[#f4f1de] font-bold">
          {totalGames}
        </p>
      </div>

      {/* Total Hours */}
      <div className="bg-[#2c2c3e]/50 p-4 text-center">
        <p className="font-press-start text-xs text-[#f4a261] uppercase mb-1">
          Total Hours
        </p>
        <p className="font-vt323 text-4xl text-[#f4f1de] font-bold">
          {totalHours}
        </p>
      </div>

      {/* Top Genres */}
      <div className="bg-[#2c2c3e]/50 p-4 text-center">
        <p className="font-press-start text-xs text-[#a8a8b3] uppercase mb-1">
          Top Genres
        </p>
        <p className="font-vt323 text-2xl text-[#f4f1de] truncate">
          {top3Genres.length === 0 ? "None" : top3Genres.join(', ')}
        </p>
      </div>

    </div>

    {/* Progress Bar */}
    <div className="bg-[#2c2c3e]/30 p-4 space-y-2">
      <p className="font-press-start text-xs text-[#a8a8b3] uppercase mb-2">
        Library Breakdown
      </p>
      <StatsProgressBar counts={statusCounts} totalGames={totalGames} />
    </div>

  </div>
);
}


function Library ({ userGames }) {

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const clickSound = new Audio(clickAudio);

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

  displayedGames.sort((a, b) => a.game_title.localeCompare(b.game_title));
  favouriteGames.sort((a, b) => a.game_title.localeCompare(b.game_title));

  return (
    <div className="w-full max-w-6xl mx-auto font-vt323">

      {/* Favorites Games */}
      <section className="w-full max-w-5xl mx-auto">
        <GameRow title="Favourite Games" games={favouriteGames} />
      </section>

      <h2 className="text-lg md:text-xl text-[#f4f1de] font-press-start border-[#2c2c3e] pt-10 mt-10">
        Your Library
      </h2>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#1c1c28] p-4 mt-5 pixel-box">

        {/* Filtering */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">

          {/* Select box */}
          <div className="relative min-w-[160px]">
            <select
              name="filter" 
              id="filter" 
              onChange={handleSelect}
              value={filterStatus}
              className="w-full appearance-none bg-[#2c2c3e] text-[#f4f1de] font-vt323 text-xl px-4 py-2 focus:outline-none cursor-pointer"
            >
              <option value={'all'}>All</option>
              <option value={GAME_STATUS.PLAYING}>Playing</option>
              <option value={GAME_STATUS.WANT_TO_PLAY}>Plan to Play</option>
              <option value={GAME_STATUS.COMPLETED}>Completed</option>
              <option value={GAME_STATUS.REPLAYING}>Replaying</option>
              <option value={GAME_STATUS.PAUSED}>Paused</option>
              <option value={GAME_STATUS.DROPPED}>Dropped</option>
            </select>

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#83c5be]">
              ▼
            </span>
          </div>

          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <input 
              type='text' 
              placeholder="Search games..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pixel-box w-full bg-[#2c2c3e] text-[#f4f1de] placeholder-[#a8a8b3]/50 font-vt323 text-xl px-4 py-2 focus:outline-none"
            />
          </div>

          {/* Clear input */}
          {searchQuery && 
            <button
              onClick={() => {
                clickSound.play();
                setSearchQuery('');
              }}
              className="pixel-box font-press-start text-xs py-2.5 px-4 bg-[#e76f51] hover:bg-[#d65f42] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
            >
              CLEAR
            </button>
          }

        </div>

        <div className="text-right text-[#a8a8b3] text-xl font-vt323">
          SHOWING <span className="text-[#f4a261]">{displayedGames.length}</span> GAMES
        </div>

      </div>


      {/* Main grid */}
      <section className="mt-6">
        <GameGrid
          title={
            filterStatus === 'all'
              ? 'ALL GAMES'
              : `${(STATUS_MAP[filterStatus]).toUpperCase()}`
          }
          games={displayedGames}
          cols="5"
        />
      </section>

    </div>
  );
}


export function Profile () {

  const token = sessionStorage.getItem('token');
  const[user, setUser] = useState(null);
  const[loading, setLoading] = useState(true)
  const [userGames, setUserGames] = useState([]);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // fetch profile info
  useEffect(() => {
    if (!token) {
      console.error("No token found in sessionStorage!");
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
      const token = sessionStorage.getItem('token');
      
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

        <div className="flex flex-col items-center justify-center min-h-[300px] w-full gap-4 font-vt323 p-8">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#83c5be] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-4 h-4 bg-[#f4a261] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-4 h-4 bg-[#e76f51] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <p className="font-press-start text-sm text-[#f4a261] animate-pulse tracking-widest uppercase">
            LOADING PROFILE...
          </p>
        </div>
      </div>
    );}

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
