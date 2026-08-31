import { useAuth } from '../../../services/authContext.jsx';
import { Link } from 'react-router-dom';

function Roulette ({}) {}


export function Footer({}) {

  const { isAuthenticated, logout } = useAuth();

  return (
    <footer className="bg-slate-900 text-white mt-12">
      
      <div className="flex flex-row justify-evenly">

        {/* Desc */}
        <section>
          <h1>GameDex</h1>
          <p>Track your library,</p>
          <p>discover games, and</p>
          <p>share stats.</p>
        </section>

        {/* Quick links */}
        <section>
          <h1>Quick Links</h1>
          <ul>
            <li>
              <Link to={'/'}>
                <p>Home</p>
              </Link>
            </li>

            {isAuthenticated && (
              <li>
                <Link to={'/profile'}>
                  <p>Profile</p>
                </Link>
              </li>
            )}

            {isAuthenticated 
              ? (<li>
                  <Link to={'/'}>
                    <p onClick={(e) => logout(e)}>Log out</p>
                  </Link>
                </li>)
              : (<li>
                  <Link to={`/login`}>
                    <p>Login</p>
                  </Link>
                </li>)
            }
          </ul>
        </section>

        {/* Tools */}
        <section>
          <h1>Tools</h1>
          <ul>
            <li>
              <Link to="/roulette">Game Roulette (TBA)</Link>
            </li>
          </ul>        
        </section>

        {/* Attribution */}
        <section>
          <h1>Attribution</h1>
          <p>
            Powered by{' '}
            <a href="https://rawg.io" target="_blank" rel="noopener noreferrer">
              RAWG API
            </a>
          </p>
        </section>

      </div>

      {/* Copyright */}
      <div>
        <p>© 2026 GameDex. Built with React & Node.</p>
      </div>

    </footer>

  );

}