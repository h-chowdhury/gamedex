import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Home } from './home';
import { SignUp } from './signup';
import { Login } from './login';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/login' element={<Login />}/>
    </Routes>
  );

}

export default App
