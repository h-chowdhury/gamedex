import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../../services/authContext.jsx';
import clickAudio from "/audio/click.mp3";


function NavbarLink ({name, page}) {
  const { logout } = useAuth();
  const clickSound = new Audio(clickAudio);

  const linkStyle = "text-slate-400 font-vt323 text-xl hover:text-[#83c5be]";

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
      <Link to={`/${page}`} onClick={() => clickSound.play()}>
        <p className={linkStyle}>{name}</p>
      </Link>
    </li>
  );
}


export function Navbar () {

  const { isAuthenticated } = useAuth();
  return (
  <div className="flex flex-row justify-between bg-[#1c1c28] border-[#2c2c3e] px-2 py-1 shadow-md">
    <div className="flex flex-row gap-5 items-center">
      <img src="/roboicon.png" className="w-[3em] h-[3em] mb-3 ml-6 mt-3 [image-rendering:pixelated] drop-shadow-[0_2px_0px_#1c1c28]" />

      <div className="font-press-start text-[#f4f1de] tracking-wider">
        <h1 className="text-lg md:text-xl drop-shadow-[2px_2px_0px_#f4a261]">GameDex</h1>
      </div>
    </div>

    <nav className="flex items-center">
      <ul className="flex flex-row gap-7 items-center mr-6 font-vt323 text-xl text-[#83c5be]">
        <li><NavbarLink name={"Home"} page="" /></li>
        <li><NavbarLink name={"Browse"} page="discover" /></li>
        {isAuthenticated && <li><NavbarLink name={"Profile"} page="profile" /></li>}
        {isAuthenticated && <li><NavbarLink name={"Log out"} page="logout" /></li>}
        {!isAuthenticated && <li><NavbarLink name={"Login"} page="login" /></li>}
        {!isAuthenticated && <li><NavbarLink name={"Sign up"} page="signup" /></li>}
      </ul>
    </nav>
  </div>
);
}