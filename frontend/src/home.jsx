import { Navbar } from './components/navbar.jsx';
import { GameCard } from './components/gamecard.jsx'
import { GameRow } from './components/gamerow.jsx'
import { GameGrid } from './components/gamegrid.jsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth, AuthProvider } from '../../services/authContext.jsx';
import { getUserIdFromToken } from '../../services/authServices.js';


function ActivityRow ({ data }) {

  if (!data) return null;

  const username = data.user?.username || Anon;
  const avatar = data.user?.avatar;
  const game = data.gameData?.name || data.game_title || 'Unknown Game';
  const gameImg = data.gameData?.background_image || data.background_image || '';
  const action = data.action;
  const date = data.createdAt || ''; // change so that it says today / yesterday / 1 day ago... 6 days ago... 1 week ago etc.
  
  return (
    <Link
      to={`/game/${data.game_id}`}
      state={{ game: data.gameData }}
      className="cursor-pointer"
    >
      <div className="w-full bg-slate-500 text-white flex flex-row">
        <p>{username}</p>
        <img src={avatar.startsWith('https') ? avatar : `http://localhost:5000${avatar}?t=${Date.now()}`} className="pixel-box m-1 w-[4em] h-[4em] object-cover" alt="avatar" />

        <p>{game}</p>
        <p>{action}</p>
        <img src={gameImg} className="pixel-box m-1 w-[4em] h-[4em] object-cover" alt="bg"/>

        <p>{date}</p>
      </div>
    </Link>
  );
}

function GlobalFeed () {


}


function PersonalFeed () {


}


function ActivityFeed () {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div>Loading activity feed...</div>

  return (
    <div>

      <div className="flex flex-row justify-between">
        <h2 className="text-xl text-white">Activity</h2>

        <div className="flex flex-row gap-5">
          <button className="bg-slate-300 text-black">My Activity</button>
          <button className="bg-slate-300 text-black">Global Activity</button>
        </div>
      </div>

      {/* <ActivityRow gameData={""} username={""} action={""} date={""}/>
      <ActivityRow gameData={""} username={""} action={""} date={""}/>
      <ActivityRow gameData={""} username={""} action={""} date={""}/>
      <ActivityRow gameData={""} username={""} action={""} date={""}/>
      <ActivityRow gameData={""} username={""} action={""} date={""}/>
      <ActivityRow gameData={""} username={""} action={""} date={""}/>
      <ActivityRow gameData={""} username={""} action={""} date={""}/> */}

      <div className="flex flex-col gap-3">
        {activities.map((item) => (
          <div key={item._id} className="">
            <ActivityRow data={item} />
          </div>
        ))}
      </div>

    </div>
  );
}

function UserView () {

  const [userGames, setUserGames] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {

      const userId = getUserIdFromToken();
      const token = localStorage.getItem('token');
      
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

  if ( loading || !user ) return <div className="text-white">Loading dashboard...</div>

  return (
    <div>
      <div>
        <h1 className="text-white text-3xl font-press-start">Welcome Back {(user.username.charAt(0).toUpperCase() + user.username.slice(1)) || null}!</h1>
      </div>

      {/* Games in progress */}
      <GameRow title={"Games you're currently playing"} games={gamesInProgress} />

      {/* Games planned */}
      <GameRow title={"Games to play Next"} games={gamesPlanned} />

      {/* Recent activity feed -- global + local */}
      <ActivityFeed />

    </div>

  );

}


function GuestView () {

  const features = [
    {
      title: "Discover your obsessions",
      desc: "Track what you're playing, rate your backlog, and analyze your favorite gaming genres with personalised shelf stats."
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
    <div className="text-white flex flex-col gap-10 m-10">
      <h1 className="text-center font-press-start text-3xl">The next-generation gaming platform</h1>
      <p className="text-center font-press-start text-xl">Track, rate, and organize your favorite video games.</p>

      <div className="grid grid-cols-2 gap-10">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col">
            <h3 className="text-xl font-press-start">{feature.title}</h3>
            <p className=" text-xl font-vt323">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div>
        <Link to="/signup" className="bg-slate-700 text-white">
          Join Now
        </Link>
      </div>
    </div>

  );

}





export function Home() {

  const {isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />

      {isAuthenticated ? <UserView /> : <GuestView />}

    </div>
  );

}