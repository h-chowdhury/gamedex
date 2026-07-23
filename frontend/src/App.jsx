import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Home } from './home';
import { SignUp } from './signup';
import { Login } from './login';
import { Profile } from './profile';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/profile' element={<Profile />}/>
    </Routes>
  );

}

export default App
