import { useAuth } from '../context/authContext.jsx';
import { Link } from 'react-router-dom';

function Roulette ({}) {}

export function Footer({}) {

  const { isAuthenticated, logout } = useAuth();

  return (
    <footer className="bg-[#1c1c28] text-[#f4f1de] mt-18 pt-8 pb-4 px-4 shadow-lg">
      
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-4 pb-8 border-b-3 border-[#2c2c3e]">

        {/* Desc */}
        <section className="space-y-1">
          <h1 className="font-press-start text-[#f4a261] text-xs tracking-wider drop-shadow-[2px_2px_0px_#1c1c28]">
            GameDex
          </h1>
          <div className="font-vt323 text-[#a8a8b3] text-base leading-tight">
            <p>Track your library,</p>
            <p>discover games, and</p>
            <p>share stats.</p>
          </div>
        </section>

        {/* Quick links */}
        <section className="space-y-1">
          <h1 className="font-press-start text-[#83c5be] text-[10px] uppercase tracking-wide border-b-3 border-[#2c2c3e] pb-1">
            Quick Links
          </h1>
          <ul className="font-vt323 text-base text-[#f4f1de] space-y-0.5">
            <li>
              <Link to={'/'} className="hover:text-[#f4a261] transition-colors">
                <p>Home</p>
              </Link>
            </li>

            {isAuthenticated && (
              <li>
                <Link to={'/profile'} className="hover:text-[#f4a261] transition-colors">
                  <p>Profile</p>
                </Link>
              </li>
            )}

            {isAuthenticated 
              ? (<li>
                  <Link to={'/'} className="hover:text-[#f4a261] transition-colors">
                    <p onClick={(e) => logout(e)}>Log out</p>
                  </Link>
                </li>)
              : (<li>
                  <Link to={`/login`} className="hover:text-[#f4a261] transition-colors">
                    <p>Login</p>
                  </Link>
                </li>)
            }
          </ul>
        </section>

        {/* Tools */}
        <section className="space-y-1">
          <h1 className="font-press-start text-[#83c5be] text-[10px] uppercase tracking-wide border-b-3 border-[#2c2c3e] pb-1">
            Tools
          </h1>
          <ul className="font-vt323 text-base text-[#f4f1de] space-y-0.5">
            <li>
              <Link to="/roulette" className="hover:text-[#f4a261] transition-colors">
                Game Roulette (TBA)
              </Link>
            </li>
          </ul>        
        </section>

        {/* Attribution */}
        <section className="space-y-1">
          <h1 className="font-press-start text-[#83c5be] text-[10px] uppercase tracking-wide border-b-3 border-[#2c2c3e] pb-1">
            Attribution
          </h1>
          <p className="font-vt323 text-base text-[#a8a8b3]">
            Powered by{' '}
            <a 
              href="https://rawg.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#83c5be] hover:text-[#f4a261] underline decoration-dotted transition-colors"
            >
              RAWG API
            </a>
          </p>
        </section>

      </div>

      {/* Copyright */}
      <div className="max-w-4xl mx-auto pt-3 text-center font-vt323 text-[#a8a8b3] text-sm">
        <p>© 2026 GameDex. Built with React & Node.</p>
      </div>

    </footer>
  );

}