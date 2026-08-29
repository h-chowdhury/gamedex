import { Navbar } from './components/navbar.jsx';
import { Footer } from './components/footer.jsx';
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form } from './form.jsx'
import { loginUser } from '../../services/authServices.js'
import { useAuth } from '../../services/authContext.jsx';

export function Login () {

  const [formData, setFormData] = useState({username: '', password: ''});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const {login, isAuthenticated } = useAuth();

  const handleValidation = (formData) => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.'
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.'
    }
    return newErrors;
  }

  const handleSubmit = async (newFormData) => {
    setErrors({});
    const { username, password } = newFormData;

    const validationErrors = handleValidation(newFormData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await loginUser(username, password);

      if (result?.token) {
        login(result.token)
        //navigate('/profile');
      } 
      if (result?.newErrors && Object.keys(result.newErrors).length > 0) {
        setErrors(result.newErrors);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  }

  return (
    <div>

      <Navbar />
      <Form isSignup={false} submitBtnText={"Login"} onSubmit={handleSubmit} errors={errors}/>
      <Footer />
    </div>
  )
}
