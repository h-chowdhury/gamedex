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
          <p class={linkStyle} onClick={(e) => logout(e)}>Log out</p>
        </Link>
      </li>
    );
  } 

  return (
    <li>
      <Link to={`/${page}`}>
        <p class={linkStyle}>{name}</p>
      </Link>
    </li>
  );
}


export function Navbar () {

  const { isAuthenticated } = useAuth();
  return (
    <nav className="flex flex-row justify-between py-5 px-7 bg-slate-900">
      <div className="font-press-start text-white">
        <h1>GameDex</h1>
      </div>

      <ul className="flex flex-row gap-7">
        <NavbarLink name={"Home"} page="" />
        {isAuthenticated && <NavbarLink name={"Profile"} page="profile" />}
        <NavbarLink name={"Browse"} page="discover" />
        {isAuthenticated && <NavbarLink name={"Log out"} page="logout" />}
        {!isAuthenticated && <NavbarLink name={"Login"} page="login" />}
        {!isAuthenticated && <NavbarLink name={"Sign up"} page="signup" />}
      </ul>
    </nav>
  );
}