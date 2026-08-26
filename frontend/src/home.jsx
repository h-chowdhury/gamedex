import { Navbar } from './components/navbar.jsx';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth, AuthProvider } from '../../services/authContext.jsx';
import { getUserIdFromToken } from '../../services/authServices.js';

function UserView () {

  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch user shelf
  useEffect(() => {
    const fetchUserShelf = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        const res = await fetch(`http://localhost:5000/fetch-entry?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });

        const result = await res.json();

        if (res.ok) {
          setUserGames(result.data || []);
        }

      } catch (err) {
        console.error("Error fetching user shelf:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserShelf();
  }, []);


  const gamesInProgress = userGames.filter((g) => g.status === "playing");
  const gamesPlanned = userGames.filter((g) => g.status === "plan_to_play")

  if (loading) return <div>Loading dashboard...</div>



  // Last game logged/updated -- quick log?

  // Games in progress
  // Games planned
  // Fave genre highlight

  // Trending among users
  // Recent activity feed

  // Backlog roulette
}


function GuestView () {

}





export function Home() {

  const {isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />

    </div>
  );

}