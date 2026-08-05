import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function InputField ({name, type, onChange}) {
  return (
    <div className="pixel-outline-slate w-full max-w-md">
      <input 
      className="pixel-box w-full px-4 py-2.5 bg-slate-800 text-white font-vt323 text-xl placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-transparent transition"
      type = {type}
      placeholder = {name == 'passwordConfirm'? "Confirm Password" : (name.charAt(0).toUpperCase())+(name.slice(1))}
      name = {name}
      onChange = {onChange} 
    />
    </div>
  )
}

export function Form ({isSignup, submitBtnText, onSubmit, errors}) {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({...(isSignup && {email}), username, password, ...(isSignup && {passwordConfirm})});
  }

  // Styles
  const titleClass = "text-2xl text-white font-press-start"
  const headerClass = "text-xl text-slate-400 pt-1 font-vt323"
  const errorClass = "pixel-box text-sm text-red-300 font-vt323 text-[1.1em] bg-red-950/40 border-l-4 border-red-500 rounded-r-lg px-4 py-3 mt-1";
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <form onSubmit={handleSubmit} className="pixel-outline-slate w-full max-w-md">

        <div className="pixel-box-lg bg-slate-900 border border-slate-800 p-8 shadow-2xl space-y-6">

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
              className="pixel-box font-press-start text-m w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition duration-100 active:scale-[0.98]"
              >{submitBtnText}
            </button>
          </div>

          <div className="flex flex-row gap-1 justify-center">
            {isSignup && <p className="text-slate-500 font-vt323 text-xl">Already have an account?</p>}
            {!isSignup && <p className="text-slate-500 font-vt323 text-xl">Not registered?</p>}

            <Link to={isSignup ? '/login' : '/signup'}>
              {isSignup && <p className="text-blue-500 hover:underline font-vt323 text-xl">Login</p>}
              {!isSignup && <p className="text-indigo-500 hover:underline font-vt323 text-xl">Create an account</p>}
            </Link>
          </div>

        </div>

      </form>
    </div>

  );

}

// const modeText = isSignup ? "Already have an account? Login" : "Not registered? Create an account";
