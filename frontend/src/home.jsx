import { Navbar } from './components/navbar.jsx';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth, AuthProvider } from '../../services/authContext.jsx';

export function Home() {

  const[game, setGame] = useState(null);
  const[loading, setLoading] = useState(true);
  const {login, logout, isAuthenticated } = useAuth();

  // useEffect (() => {
  //   fetch("http://localhost:5000/api/game/the-witcher-3-wild-hunt")
  //   .then((res) => res.json())
  //   .then((data) => {
  //     setGame(data);
  //     setLoading(false);
  //   })
  //   .catch((err) => {
  //     setLoading(false);
  //     console.error("Error loading game:", err);
  //   })
  // }, []);

  // if (loading === true) {
  //   return <h2 className="text-white">Loading game...</h2>;
  // }

  // if (loading === false && game === null) {
  //   return <h2 className="text-white">Failed to load game...</h2>;
  // }

  return (
    <div>
      <Navbar />

      {/* <div>
        <h2 className="text-white">{game.name}</h2>
        <p className="text-white">{game.metacritic || 'N/A'}</p>
        <p className="text-white">{game.released}</p>
        <p className="text-white">{game.description_raw}</p>
        <img src={game.background_image}/>
      </div> */}

      <Link to="viewGame">
        <p className="text-white">go to game page</p>
      </Link>

    </div>
  );

}