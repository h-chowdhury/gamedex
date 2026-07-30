import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './home';
import { SignUp } from './signup';
import { Login } from './login';
import { Profile } from './profile';
import { AuthProvider, useAuth } from '../../services/authContext.jsx';

function AppContent() {

  // const [token, setToken] = useState(localStorage.getItem('token') || null);
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/signup' element={isAuthenticated ? <Navigate to='/profile' /> : <SignUp /> } />
      <Route path='/login' element={isAuthenticated ? <Navigate to='/profile' replace /> : <Login /> }/>
      <Route path='/profile' element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}/>
    </Routes>
  );

}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
