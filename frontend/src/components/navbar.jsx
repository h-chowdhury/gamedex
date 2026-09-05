import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import clickAudio from "/audio/click.mp3";


function NavbarLink ({name, page}) {
  const { logout } = useAuth();
  const clickSound = new Audio(clickAudio);

  const linkStyle = "text-slate-400 font-vt323 text-base hover:text-[#83c5be]";

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
  <div className="flex flex-row justify-between items-center bg-[#1c1c28] px-8 shadow-md">
    <div className="flex flex-row gap-3 items-center">
      <img src="/roboicon.png" className="w-10 h-10 mb-1 mr-1 [image-rendering:pixelated] drop-shadow-[0_2px_0px_#1c1c28]" />

      <div className="font-press-start text-[#f4f1de] tracking-wider">
        <h1 className="text-base drop-shadow-[2px_2px_0px_#f4a261]">GameDex</h1>
      </div>
    </div>

    <nav className="flex items-center">
      <ul className="flex flex-row gap-6 items-center font-vt323 py-4 pb-5 text-lg text-[#83c5be] pb-1">
        <NavbarLink name={"Home"} page="" />
        <NavbarLink name={"Browse"} page="discover" />
        {isAuthenticated && <NavbarLink name={"Profile"} page="profile" />}
        {isAuthenticated && <NavbarLink name={"Log out"} page="logout" />}
        {!isAuthenticated && <NavbarLink name={"Login"} page="login" />}
        {!isAuthenticated && <NavbarLink name={"Sign up"} page="signup" />}
      </ul>
    </nav>
  </div>
);
}