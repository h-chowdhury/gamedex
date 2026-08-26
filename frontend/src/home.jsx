import { Navbar } from './components/navbar.jsx';
import { GameCard } from './components/gamecard.jsx'
import { GameRow } from './components/gamerow.jsx'
import { GameGrid } from './components/gamegrid.jsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth, AuthProvider } from '../../services/authContext.jsx';
import { getUserIdFromToken } from '../../services/authServices.js';


function ActivityRow () {

  return (
    <div className="w-full bg-slate-500 text-white m-5">
      <p>IMAGE</p>
      <p>Username</p>
      <p>Added game to library</p>
      <p>Today</p>
    </div>
  );
}

function ActivityFeed () {
  return (
    <div>

      <div className="flex flex-row justify-between">
        <h2 className="text-xl text-white">Activity</h2>

        <div className="flex flex-row gap-5">
          <button className="bg-slate-300 text-black">My Activity</button>
          <button className="bg-slate-300 text-black">Global Activity</button>
        </div>
      </div>

      <ActivityRow />
      <ActivityRow />
      <ActivityRow />
      <ActivityRow />
      <ActivityRow />

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
        const headers = { Authorization: `Bearer ${token}`};

        const [resGames, resUser] = await Promise.all([
          fetch(`http://localhost:5000/fetch-entry?userId=${userId}`, { headers}),
          fetch('http://localhost:5000/users/me', { headers })
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