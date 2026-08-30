import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../../services/authContext.jsx';


function NavbarLink ({name, page}) {
  const { logout } = useAuth();

  const linkStyle = "text-slate-400 font-vt323 text-xl hover:text-slate-300";

  if (name == "Log out") {
    return (
      <li>
        <Link to={'/'}>
          <p className={linkStyle} onClick={(e) => logout(e)}>Log out</p>
        </Link>
      </li>
    );
  } 

  return (
    <li>
      <Link to={`/${page}`}>
        <p className={linkStyle}>{name}</p>
      </Link>
    </li>
  );
}


export function Navbar () {

  const { isAuthenticated } = useAuth();
  return (
    <div className="flex flex-row justify-between bg-slate-900">
      <div className="flex flex-row gap-5 items-center">
        <img src="/roboicon.png" className="w-[3em] h-[3em] mb-3 ml-6 mt-3 [image-rendering:pixelated]" />

        <div className="font-press-start text-white">
          <h1>GameDex</h1>
        </div>
      </div>

      <nav className="flex items-center">
        <ul className="flex flex-row gap-7 items-center mr-6">
          <li><NavbarLink name={"Home"} page="" /></li>
          {isAuthenticated && <li><NavbarLink name={"Profile"} page="profile" /></li>}
          <li><NavbarLink name={"Browse"} page="discover" /></li>
          {isAuthenticated && <li><NavbarLink name={"Log out"} page="logout" /></li>}
          {!isAuthenticated && <li><NavbarLink name={"Login"} page="login" /></li>}
          {!isAuthenticated && <li><NavbarLink name={"Sign up"} page="signup" /></li>}
        </ul>
      </nav>
    </div>
  );
}