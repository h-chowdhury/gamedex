import { Navbar } from './components/navbar.jsx';
import { Footer } from './components/footer.jsx';
import { GameCard } from './components/gamecard.jsx'
import { GameRow } from './components/gamerow.jsx'
import { GameGrid } from './components/gamegrid.jsx'
import { ACTION_MAP } from '../../services/constants.js';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth, AuthProvider } from '../../services/authContext.jsx';
import { getUserIdFromToken } from '../../services/authServices.js';
import clickAudio from "/audio/click.mp3";


function formatDate(date) {
  if (!date) return '';

  const actionDate = new Date(date);
  const now = new Date();

  actionDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = now - actionDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0 ||isNaN(diffDays)) {
    return new Date(date).toLocaleDateString();
  }

  const relativeDays = [
    'Today',
    'Yesterday',
    '2 days ago',
    '3 days ago',
    '4 days ago',
    '5 days ago',
    '6 days ago',
    '1 week ago',
  ];

  return relativeDays[diffDays] || actionDate.toLocaleDateString();
}

function ActivityRow ({ data }) {

  if (!data) return null;

  const username = data.user?.username || Anon;
  const avatar = data.user?.avatar;
  const game = data.gameData?.name || data.game_title || 'Unknown Game';
  const gameImg = data.gameData?.background_image || data.background_image || '';
  const action = data.action;
  const date = data.createdAt || '';
  const clickSound = new Audio(clickAudio);

  return (
    <Link
      to={`/game/${data.game_id}`}
      state={{ game: data.gameData }}
      className="cursor-pointer block"
      onClick={() => clickSound.play()}
    >
      <div className="pixel-box w-full bg-[#2c2c3e] hover:bg-[#34344a] text-[#f4f1de] flex flex-row items-center transition-colors font-vt323 text-lg overflow-hidden">
        
        <img
          src={gameImg}
          className="w-[4.5em] h-[6em] object-cover flex-shrink-0 border-r-4 border-[#f4a261] mr-5"
          alt="bg"
        />

        <div className="flex flex-row items-center gap-3 py-3 pr-4 flex-1">
          <img
            src={
              avatar?.startsWith('https')
                ? avatar
                : `http://localhost:5000${avatar}?t=${Date.now()}`
            }
            className="pixel-box w-[4em] h-[4em] object-cover flex-shrink-0"
            alt="avatar"
          />

          <div className="flex flex-col text-2xl flex-1">
            <div className="flex flex-row justify-between items-center w-full truncate">
              <p className="text-[#83c5be]">{username.charAt(0).toUpperCase() + username.slice(1)}</p>
              <p className="text-lg text-[#a8a8b3]">{formatDate(date)}</p>
            </div>

            <div className="flex flex-row items-center gap-2.5">
              <span className="text-[#a8a8b3]">{ACTION_MAP[action]}</span>
              <p className="text-[#f4a261]">{game}</p>
              <p className="text-[#a8a8b3]">{`${action === "removed" ? " from their library" : ""}`}</p>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}

function FeedEntries({ data }) {

  return (
    <div>
      {data.length > 0 ? (
        <div className="border-t-4 border-[#414150] flex flex-col gap-3 pt-5">
          {data.map((item) => (
            <div key={item._id} className="">
              <ActivityRow data={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="pixel-box text-[#a8a8b3] font-vt323 text-xl p-4 bg-[#2c2c3e]">
          <p>No activity to display.</p>
        </div>
      )}
    </div>
  );
}

function ActivityFeed () {

  const [activities, setActivities] = useState([]);
  const [isGlobal, setIsGlobal] = useState(true);
  const [loading, setLoading] = useState(true);
  const clickSound = new Audio(clickAudio);

  useEffect (() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch ('http://localhost:5000/activity-feed/global');
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch (err) {
        console.error("Failed to load activities:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);

  console.log("CHECKING::: ", activities[0])

  const displayedLogs = isGlobal 
    ? activities
    : activities.filter((log) => String(log.user?._id) === String(getUserIdFromToken()));

  if (loading) return <div>Loading activity feed...</div>

  // border-2 border-[#2c2c3e]

  return (
    <div className="w-full mt-7 space-y-5 pt-6">
      
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg md:text-xl text-[#f4f1de] font-press-start">
          {isGlobal ? 'Global Activity' : 'My Activity'}
        </h2>

        <button
          className="pixel-box bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-press-start text-xs px-4 py-2 transition-all active:translate-y-0.5"
          onClick={() => {
            setIsGlobal(!isGlobal);
            clickSound.play();
          }}
        >
          {isGlobal ? 'View My Activity' : 'View Global Activity'}
        </button>
      </div>

      <FeedEntries data={displayedLogs} />
      
    </div>
  );
}

function StatsCard () {}

function UserView () {

  const [userGames, setUserGames] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {

      const userId = getUserIdFromToken();
      const token = sessionStorage.getItem('token');
      
      if (!token || !userId) {
        console.warn("No token or userId found in storage.");
        setLoading(false);
        return;
      }

      try {
        const [resGames, resUser] = await Promise.all([
          fetch(`http://localhost:5000/fetch-entry?userId=${userId}`, { 
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('http://localhost:5000/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        if (resGames.ok) {
          const resultGames = await resGames.json();
          setUserGames(resultGames.data || resultGames || []);
        } else {
          console.error("Games fetch failed with status:", resGames.status);
        }

        if (resUser.ok) {
          const resultUser = await resUser.json();
          setUser(resultUser.data || resultUser || null);
        } else {
          console.error("User fetch failed with status:", resUser.status);
        }

      } catch (err) {
        console.error("Error fetching user shelf:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const gamesInProgress = userGames.filter((g) => g.status === "playing");
  const gamesPlanned = userGames.filter((g) => g.status === "plan_to_play")

  if ( loading || !user ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full gap-4 font-vt323 p-8">

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#83c5be] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-4 h-4 bg-[#f4a261] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-4 h-4 bg-[#e76f51] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        <p className="font-press-start text-sm text-[#f4a261] animate-pulse tracking-widest uppercase">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col mt-4">
      <div>
        <h1 className="text-[#f4f1de] text-lg md:text-xl font-press-start tracking-wide uppercase">
          Welcome Back, <span className="text-[#f4a261]">{user.username}</span>!
        </h1>
      </div>

      <GameRow
        title={"Games you're currently playing"}
        games={gamesInProgress}
      />

      <GameRow 
        title={'Games to play Next'} 
        games={gamesPlanned} 
      />

      <div>
        <ActivityFeed />
      </div>
    </div>
  );

}


function GuestView () {

  const features = [
    {
      title: "Find your thing",
      desc: "Track what you're playing, rate your backlog, and analyse your favorite gaming genres with personalised shelf stats."
    },
    {
      title: "Build your digital shelf",
      desc: "Sort games into Currently Playing, Completed, Paused, or Plan to Play so you never forget what's next in your queue."
    },
    {
      title: "Keep track of your journey",
      desc: "Add personal notes, update your current play status, and record when you beat each title in your collection."
    },
    {
      title: "Explore powered by RAWG",
      desc: "Instantly search tens of thousands of games across modern consoles and retro systems with rich metadata and artwork."
    }
  ];

  return (
    <div className="text-[#f4f1de] flex flex-col gap-10 m-10 mt-20 max-w-5xl mx-auto items-center">
      <h1 className="text-center font-press-start text-3xl text-[#f4a261]">
        The next-generation gaming platform
      </h1>
      <p className="text-center font-vt323 text-3xl text-[#83c5be] mb-8">
        Track, rate, and organize your favorite video games.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col-4 pixel-box bg-[#1c1c28] p-6 px-8 items-center hover:-translate-y-1 transition-all"
          >
            <h3 className="text-lg font-press-start text-[#f4a261] mb-3">
              {feature.title}
            </h3>
            <p className="text-xl font-vt323 text-[#a8a8b3] leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link
          to="/signup"
          className="pixel-box-lg bg-[#e76f51] hover:bg-[#f4a261] text-[#1c1c28] font-press-start px-8 py-4 text-sm inline-block active:translate-y-0.5 transition-all"
        >
          Join Now
        </Link>
      </div>
    </div>
  );

}


export function Home() {

  const {isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen text-[#f4f1de]">
      <Navbar />

      {isAuthenticated ? <UserView /> : <GuestView />}

      <Footer />
    </div>
  );

}