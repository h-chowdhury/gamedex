import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import clickAudio from "/audio/click.mp3";

function InputField ({name, type, onChange}) {
  return (
    <div className="pixel-outline-slate w-full max-w-md">
      <input 
        className="pixel-box w-full px-4 py-2.5 bg-[#1c1c28] text-[#f4f1de] font-vt323 text-xl placeholder-[#a8a8b3]/60 focus:outline-none focus:bg-[#252536] transition"
        type={type}
        placeholder={name === 'passwordConfirm' ? "Confirm Password" : (name.charAt(0).toUpperCase())+(name.slice(1))}
        name={name}
        onChange={onChange} 
      />
    </div>
  );
}

export function Form ({isSignup, submitBtnText, onSubmit, errors}) {

  const clickSound = new Audio(clickAudio);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({...(isSignup && {email}), username, password, ...(isSignup && {passwordConfirm})});
  }

  // Styles
  const titleClass = "text-xl md:text-2xl text-[#f4f1de] font-press-start tracking-wide drop-shadow-[2px_2px_0px_#f4a261]";
  const headerClass = "text-xl text-[#a8a8b3] pt-1 font-vt323";
  const errorClass = "pixel-box text-sm text-[#80493a] font-bold font-vt323 text-[1.1em] bg-[#b45252]/20 border-l-4 border[#b45252] px-4 py-2 mt-2";
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="pixel-outline-slate w-full max-w-md">

        <div className="pixel-box-lg bg-[#1c1c28] p-8 space-y-6">

          <div className="text-center space-y-2">
            {isSignup && 
              <div>
                <h1 className={titleClass}>Join GameDex</h1>
                <h2 className={headerClass}>Enter your details to access GameDex</h2>
              </div>
            }

            {!isSignup && 
              <div>
                <h1 className={titleClass}>Welcome Back</h1>
                <h2 className={headerClass}>Enter your credentials to access GameDex</h2>
              </div>
            }
          </div>

          <div>
            {/* Email */}
            {isSignup && <InputField name={"email"} type={"text"} onChange={(e) => setEmail(e.target.value)}/>}
            {isSignup && errors.email?.length > 0 && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div>
            {/* Username */}
            <InputField name={"username"} type={"text"} onChange={(e) => setUsername(e.target.value)}/> 
            {errors.username?.length > 0 && <p className={errorClass}>{errors.username}</p>}
          </div>

          <div>
            {/* Password */}
            <InputField name={"password"} type={"password"} onChange={(e) => setPassword(e.target.value)}/> 
            {errors.password?.length > 0 && <p className={errorClass}>{errors.password}</p>}
          </div>

          <div>
            {/* Password confirm */}
            {isSignup && <InputField name={"passwordConfirm"} type={"password"} onChange={(e) => setPasswordConfirm(e.target.value)}/>}
            {isSignup && errors.passwordConfirm?.length > 0 && <p className={errorClass}>{errors.passwordConfirm}</p>}
          </div>

          <div>
            <button 
              className="pixel-box font-press-start text-xs md:text-sm w-full py-3 px-4 bg-[#83c5be] hover:bg-[#62b6cb] text-[#1c1c28] font-bold transition duration-100 active:translate-y-0.5 cursor-pointer"
              onClick={() => clickSound.play()}
            >
              {submitBtnText}
            </button>
          </div>

          <div className="flex flex-row gap-2 justify-center items-center">
            {isSignup && <p className="text-[#a8a8b3] font-vt323 text-xl">Already have an account?</p>}
            {!isSignup && <p className="text-[#a8a8b3] font-vt323 text-xl">Not registered?</p>}

            <Link to={isSignup ? '/login' : '/signup'}>
              {isSignup && <p className="text-[#f4a261] hover:text-[#e76f51] font-vt323 text-xl underline decoration-dotted">Login</p>}
              {!isSignup && <p className="text-[#f4a261] hover:text-[#e76f51] font-vt323 text-xl underline decoration-dotted">Create an account</p>}
            </Link>
          </div>

        </div>

      </form>
    </div>
  );

}

// const modeText = isSignup ? "Already have an account? Login" : "Not registered? Create an account";
