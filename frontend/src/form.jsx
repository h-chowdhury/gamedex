import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function InputField ({name, type, onChange}) {
  return (
    <input 
      type = {type}
      placeholder = {name}
      name = {name}
      onChange = {onChange}
      required />
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

  const modeText = isSignup ? "Already have an account? Login" : "Not registered? Create an account";

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <div>
          {/* Email */}
          {isSignup && <InputField name={"email"} type={"text"} onChange={(e) => setEmail(e.target.value)}/>}
          <p>{errors.email}</p>
        </div>

        <div>
          {/* Username */}
          <InputField name={"username"} type={"text"} onChange={(e) => setUsername(e.target.value)}/> 
          <p>{errors.username}</p>
        </div>

        <div>
          {/* Password */}
          <InputField name={"password"} type={"password"} onChange={(e) => setPassword(e.target.value)}/> 
        </div>

        <div>
          {/* Password confirm */}
          {isSignup && <InputField name={"passwordConfirm"} type={"password"} onChange={(e) => setPasswordConfirm(e.target.value)}/>}
          <p>{errors.password}</p>
        </div>

        <div>
          <button>{submitBtnText}</button>
        </div>

        <Link to={isSignup ? '/login' : '/signup'}>
          <button>{modeText}</button>
        </Link>

      </form>
    </div>

  );

}