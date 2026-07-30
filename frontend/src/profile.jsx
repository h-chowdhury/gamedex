import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext.jsx';

export function Profile () {

  const {token } = useAuth();
  const[user, setUser] = useState(null);
  const[loading, setLoading] = useState(true)

  // useEffect(() => {
  //   if (!token) {
  //     setLoading(false);
  //     return;
  //   }
  // })

  useEffect(() => {
    fetch("http://localhost:5000/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setUser(data);
      console.log("DATA: ", data);
      setLoading(false);
    })
    .catch(err => console.error(err));
  }, [token]);

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  if (!loading && user) {
    return (
      // successful load
      <div>
        <p>ID: {user._id}</p>
        <p>Username: {user.username}</p>
        <p>Bio: {user.bio}</p>
        <p>Email: {user.email}</p>
        <p>Created at: {user.date_joined}</p>
        <img src={user.avatar}/>
      </div>
    );
  } else if (!loading && !user) {
    return (
      // failed load
      <div>
        <p>Failed to load profile. Please try again.</p>
      </div>
    );
  } else if (loading) {
    return (
      // loading
      <div>
        <p>Loading profile...</p>
      </div>
    );
  }

}