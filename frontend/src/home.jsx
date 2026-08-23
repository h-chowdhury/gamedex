import { Navbar } from './components/navbar.jsx';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth, AuthProvider } from '../../services/authContext.jsx';

export function Home() {

  const {login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />

    </div>
  );

}