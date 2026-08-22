import { Navbar } from './components/navbar.jsx';
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form } from './form.jsx'
import { registerUser } from '../../services/authServices.js'
import { useAuth } from '../../services/authContext.jsx';

export function SignUp (props) {

  const [formData, setFormData] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const {login, logout } = useAuth();

  const handleValidation = (formData) => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (formData.username.length < 3) {
      newErrors.username= 'Username must be atleast 3 characters.';
    } else if (formData.username.length > 30) {
      newErrors.username= 'Username must be at most 30 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be atleast 8 characters.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain a mix of letters, numbers, and symbols.';
    }
    
    if (!formData.passwordConfirm.trim()) {
      newErrors.passwordConfirm = 'Please confirm your password.';
    } else if (formData.passwordConfirm != formData.password) {
      newErrors.passwordConfirm = 'Both passwords must match.';
    }

    return newErrors;
  }


  const handleSubmit = async (formData) => {

    setErrors({});

    const { email, username, password, passwordConfirm } = formData;

    const validationErrors = handleValidation(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...validationErrors
      }))
      // setErrors(validationErrors);
      return;
    }

    try {
      const result = await registerUser(email, username, password);

      if (result?.token) {
        login(result.token)
        navigate('/profile');
      } 

      if (result?.newErrors && Object.keys(result.newErrors).length > 0) {
        setErrors(result.newErrors);
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (

    <div>

      <Navbar />

      <Form isSignup={true} submitBtnText={"Sign Up"} onSubmit={handleSubmit} errors={errors}/>

    </div>

  )

}