import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form } from './form.jsx'
import { registerUser } from '../../services/authServices.js'

export function SignUp (props) {

  const [data, setData] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {

    console.log("Hello 1")

    const { email, username, password } = formData;

    try {
      const result = await registerUser(email, username, password);
      setData(result);

      console.log("Hello 2")

      if (result.token) {
        navigate('/profile');
        console.log(username, email, password);
      }
    } catch (err) {
      console.log(err);
    }

  };

  return (

    <div>

      <Form isSignup={true} submitBtnText={"Sign Up"} onSubmit={handleSubmit}/>

    </div>

  )

}