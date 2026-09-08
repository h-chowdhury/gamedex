import { Navbar } from './components/navbar.jsx';
import { Footer } from './components/footer.jsx';
import { useEffect, useState } from 'react'
import { GameRow } from './components/gamerow.jsx'
import { GameGrid } from './components/gamegrid.jsx'
import { getUserIdFromToken } from '../../backend/services/authServices.js';
import { GAME_STATUS, STATUS_MAP, STATUS_COLOURS } from '../../backend/services/constants.js';
import clickAudio from "/audio/click.mp3";


const APIURL = import.meta.env.VITE_API_URL || 'http://localhost:10000';


function ProfileCard ( { token, user, onProfileUpdate }) {

  const clickSound = new Audio(clickAudio);

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
      const response = await fetch(`${APIURL}/api/profile/update-profile`, {
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
    : user?.avatar?.startsWith("http")
      ? user.avatar
      : user?.avatar
        ? `${APIURL}${user?.avatar}`
        : '/default-avatar.png';


  return (
    <div className="bg-[#2c2c3e] border-b-3 border-[#1c1c28]">

      <div className="max-w-5xl mx-auto flex flex-row gap-4 py-6 items-stretch p-4 pixel-box-lg text-[#f4f1de]">

        {/* Avatar block */}
        <div className="pixel-outline-slate group relative flex-shrink-0 w-48 h-48 mr-2 bg-[#2c2c3e]">
        
          {user?.avatar ? (
            <div className="pixel-outline-teal w-full h-full">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-full h-full object-cover pixel-box-sm"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-press-start text-[10px] text-[#a8a8b3]">
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
                  <span className="text-2xl mb-1">📷</span>
                  <span className="text-base text-center text-[#83c5be]">
                    Change Avatar
                  </span>
                </label>
              </>
            )
          }
        </div>


        {/* Username, bio, etc. */}
        <div className="font-vt323 text-lg text-[#a8a8b3] flex-1 flex flex-col gap-3 w-full">
  
          <p className="font-press-start text-base md:text-lg ml-1 mt-2 text-[#f4a261] tracking-wide drop-shadow-[2px_2px_0px_#1c1c28] mt-1">
            {user.username?.toUpperCase()}
          </p>

          {isEditing
            ? (
              <form onSubmit={saveChanges} className="flex flex-col gap-2">

                <textarea
                  placeholder="Write something about yourself!"
                  className="bg-[#1c1c28] text-[#f4f1de] placeholder-[#a8a8b3]/60 pixel-box px-3 py-2 font-vt323 text-base focus:outline-none resize-none"
                  rows="2"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={165}
                />

                <div className="flex flex-wrap gap-3 pt-1">
                  <button 
                    onClick={() => clickSound.play()}
                    type="submit"
                    className="pixel-box-sm font-press-start text-[10px] py-1.5 px-3 bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
                  >
                    Save Changes
                  </button>

                  <button 
                    onClick={() => {
                      clickSound.play();
                      cancelChanges();
                    }}
                    type="button"
                    className="pixel-box-sm font-press-start text-[10px] py-1.5 px-3 bg-[#b45252] hover:bg-[#a13a3a] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
                  >
                    Cancel Changes
                  </button>

                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="pixel-box-sm text-[#f4f1de] text-base break-words line-clamp-3 bg-[#1c1c28] p-2.5 pl-3 border-[#2c2c3e]">
                  {user.bio.trim().length > 0 ? user.bio : "No bio set."}
                </p>

                <button 
                  type="button"
                  className="pixel-box-sm font-press-start text-[0.5em] py-1.5 px-3 mt-1 bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
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

          <div className="text-sm font-vt323 text-[#a8a8b3]/80 flex flex-row mt-auto justify-between">
            <p>Joined {new Date(user.date_joined).toLocaleDateString('en-UK', {month:'long', day:'numeric', year:'numeric'})}</p>
            <p>ID: <span className="text-sm">{user._id}</span> </p>
          </div>
        </div>

      </div>
    </div>
  );
}


function StatsProgressBar ({ counts, totalGames }) {

  if (!totalGames || totalGames === 0) {
    return (
    <div className="bg-[#2c2c3e]/30 p-2 text-center">
      <span className="font-vt323 text-base text-[#a8a8b3]">
        [ No games in library ]
      </span>
    </div>
  );
  }

  return (

    <div className="space-y-2 font-vt323">
      <div className="w-full h-3 flex overflow-hidden p-0.5">
        {Object.entries(counts).map(([status, count]) => {
          if (count === 0) return null;
          const percentage = (count / totalGames) * 100;

          return (
            <div 
              key={status}
              style={{ 
                width: `${percentage}%`,
                backgroundColor: STATUS_COLOURS[status] || STATUS_COLOURS.default
              }}
              className="transition-all duration-300"
              title={`${STATUS_MAP[status]}: ${count} (${Math.round(percentage)}%)`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#f4f1de]">
        {Object.entries(counts).map(([status, count]) => {
          if (count === 0) return null;
          const percentage = Math.round((count / totalGames) * 100);

          return (
            <div key={status} className="flex items-center gap-1.5">
              <span className="w-2 h-2 inline-block" style= {{backgroundColor: STATUS_COLOURS[status] || STATUS_COLOURS.default}} />
              <span className="">{STATUS_MAP[status].toUpperCase()}</span>: {' '}
              <span className="text-[#f4a261]">{count}</span> {' '}
              <span className="text-[#a8a8b3] text-xs">({percentage}%)</span>
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

  userGames.forEach((game) => {
    if (game.status in statusCounts) { 
      statusCounts[game.status] += 1; 
    }
    totalHours += game.hours_played;
  });

  return (
  <div className="pixel-box bg-[#1c1c28] p-6 text-[#f4f1de] mt-6 space-y-4 max-w-4xl mx-auto">
    
    <div className="p-1 pt-0 flex items-center gap-2 border-b-3 border-[#2c2c3e] pb-2">
      <div className="w-2.5 h-2.5 bg-[#83c5be] mb-1 mr-1 mr-2" />
      <h2 className="text-[#f4a261] font-press-start text-xs uppercase tracking-wider">
        Player Statistics
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      
      {/* Total Games */}
      <div className="flex flex-col gap-1.5 pixel-box-sm bg-[#2c2c3e]/70 p-3 pt-4.5 text-center">
        <p className="font-press-start text-[10px] text-[#83c5be] uppercase mb-0.5">
          Total Games
        </p>
        <p className="font-vt323 text-2xl text-[#f4f1de] font-bold">
          {totalGames}
        </p>
      </div>

      {/* Total Hours */}
      <div className="flex flex-col gap-1.5 pixel-box-sm bg-[#2c2c3e]/70 p-2.5 pt-4.5 text-center">
        <p className="font-press-start text-[10px] text-[#f4a261] uppercase mb-0.5">
          Total Hours
        </p>
        <p className="font-vt323 text-2xl text-[#f4f1de] font-bold">
          {totalHours}
        </p>
      </div>

      {/* Top Genres */}
      <div className="flex flex-col gap-1.5 pixel-box-sm bg-[#2c2c3e]/70 p-2.5 pt-4.5 pb-3 text-center">
        <p className="font-press-start text-[10px] text-[#a8a8b3] uppercase mb-0.5">
          Top Genres
        </p>
        <p className="font-vt323 text-lg text-[#f4f1de] truncate">
          {top3Genres.length === 0 ? "None" : top3Genres.join(', ')}
        </p>
      </div>
    </div>

    {/* Progress Bar */}
    <div className="pixel-box p-5 bg-[#2c2c3e]/50">
      <p className="font-press-start text-[10px] text-[#a8a8b3] uppercase mb-1">
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
    <div className="w-full max-w-4xl mx-auto font-vt323">

      {/* Favorites Games */}
      <section className="w-full max-w-4xl mx-auto mt-5">
        <GameRow title="Favourite Games" games={favouriteGames} />
      </section>

      <h2 className="text-base text-[#f4f1de] font-press-start border-[#2c2c3e] pt-6 mt-6">
        Your Library
      </h2>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1c1c28] p-3 mt-3 pixel-box-sm">

        {/* Filtering */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">

          {/* Select box */}
          <div className="relative min-w-[140px]">
            <select
              name="filter" 
              id="filter" 
              onChange={handleSelect}
              value={filterStatus}
              className="pixel-box w-full appearance-none bg-[#2c2c3e] text-[#f4f1de] font-vt323 text-base px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value={'all'}>All</option>
              <option value={GAME_STATUS.PLAYING}>Playing</option>
              <option value={GAME_STATUS.WANT_TO_PLAY}>Plan to Play</option>
              <option value={GAME_STATUS.COMPLETED}>Completed</option>
              <option value={GAME_STATUS.REPLAYING}>Replaying</option>
              <option value={GAME_STATUS.PAUSED}>Paused</option>
              <option value={GAME_STATUS.DROPPED}>Dropped</option>
            </select>

            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#83c5be]">
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
              className="pixel-box w-full bg-[#2c2c3e] text-[#f4f1de] placeholder-[#a8a8b3]/50 font-vt323 text-base px-3 py-1.5 focus:outline-none"
            />
          </div>

          {/* Clear input */}
          {searchQuery && 
            <button
              onClick={() => {
                clickSound.play();
                setSearchQuery('');
              }}
              className="pixel-box font-press-start text-[10px] py-1.5 px-3 bg-[#e76f51] hover:bg-[#d65f42] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
            >
              CLEAR
            </button>
          }

        </div>

        <div className="text-right text-[#a8a8b3] text-lg font-vt323">
          SHOWING <span className="text-[#f4a261]">{displayedGames.length}</span> GAMES
        </div>

      </div>


      {/* Main grid */}
      <section className="mt-7">
        <GameGrid
          title={
            filterStatus === 'all'
              ? 'ALL GAMES'
              : `${(STATUS_MAP[filterStatus]).toUpperCase()} GAMES`
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

  useEffect(() => {
    if (!token) {
      console.error("No token found in sessionStorage!");
      setLoading(false);
      return;
    }

    fetch(`${APIURL}/api/users/me`, {
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
        const resGames = await fetch(`${APIURL}/api/fetch-entry?userId=${userId}`, { 
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

  if (loading) {
    return (
      <div>
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-[200px] w-full gap-3 font-vt323 p-6">

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#83c5be] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-[#f4a261] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-[#e76f51] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <p className="font-press-start text-xs text-[#f4a261] animate-pulse tracking-widest uppercase">
            LOADING PROFILE...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Navbar />
        <p className="text-center font-vt323 text-lg py-8 text-[#a8a8b3]">Failed to load profile. Please login or try again.</p>
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