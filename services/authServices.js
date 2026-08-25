import { useState } from 'react';

const registerUser = async (email, username, password) => {
  try {
    const res = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    })

    const data = await res.json();

    if (!res.ok) {
      console.error('Registration failed.');
    }

    return data;

  } catch (err) {
    console.error(err);
  }
};


const loginUser = async (username, password) => {
  try {

    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json();

    if (!res.ok) {
      console.error('Login failed');
    }

    return data;

  } catch (err) {
    console.error(err);
  }

}

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const parsed = JSON.parse(decodedPayload);
    return parsed.userId || null;

  } catch (err) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export {registerUser, loginUser, getUserIdFromToken};