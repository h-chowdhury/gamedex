import { Navbar } from './components/navbar.jsx';
import { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth, AuthProvider } from '../../services/authContext.jsx';

export function ViewGame() {

  const { id } = useParams();
  const location = useLocation();
  const[game, setGame] = useState(location.state?.game || null)
  const[loading, setLoading] = useState(!game);
  const {login, logout, isAuthenticated } = useAuth();

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





    </div>
  );

}