import { Navbar } from './components/navbar.jsx';
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext.jsx';

export function Profile () {

  const {token} = useAuth();
  const[user, setUser] = useState(null);
  const[loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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


  // update avatar logic
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  }

  const onFileUpload = async () => {
    if (selectedFile == null) {
      alert("Please select a file.");
      return;
    }

    // format data
    const formData = new FormData();
		formData.append(
			"avatar",
			selectedFile
		);
    console.log(selectedFile);

    setUploading(true);

    // post data
    try {
      const res = await fetch('http://localhost:5000/profile/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`},
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text(); 
        console.error("Server Error:", errorText);
        alert(`Server error (${res.status}). Check console for details.`);
        return;
      }

      const updatedUser = await res.json();
      setUser(updatedUser);

    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };


  // Final renders

  // Loading render
  if (loading) {
    return (
      <div>
        <Navbar />
        <p>Loading profile...</p>
      </div>
    );
  }

  // Failed render
  if (!loading && !user) {
    return (
      <div>
        <Navbar />
        <p>Failed to load profile. Please try again.</p>
      </div>
    );
  }

  // Successful render
  return (
    <div>
      <Navbar />
      
      <p>ID: {user._id}</p>
      <p>Username: {user.username}</p>
      <p>Bio: {user.bio}</p>
      <p>Email: {user.email}</p>
      <p>Created at: {user.date_joined}</p>

      {user.avatar && (
        <img
          src={
            user.avatar.startsWith('https') ? user.avatar : `http://localhost:5000${user.avatar}?t=${Date.now()}`
          }
          alt="Avatar"
          style={{width: '150px', height:'150px', objectFit:'cover'}}
        />
      )}

      <input type="file" accept="image/*" onChange={onFileChange} />
      <button onClick={onFileUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload avatar"}
      </button>

    </div>
  );


}