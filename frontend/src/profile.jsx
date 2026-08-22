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
    <div className="min-h-screen w-full mx-w-7xl mx-auto lg:px-8 flex flex-col bg-slate-950 overflow-x-hidden">
      <Navbar />

      <div className="pixel-outline-slate">

        <div className="pixel-box-lg bg-slate-900 m-8 flex flex-row p-5 m-5">

          <div className="flex flex-col gap-3 shrink-0">
            {user.avatar && (
              <img
                src={
                  user.avatar.startsWith('https') ? user.avatar : `http://localhost:5000${user.avatar}?t=${Date.now()}`
                }
                alt="Avatar"
                className="pixel-box m-1"
                style={{width: '18em', height:'18em', objectFit:'cover'}}
              />
            )}

            <div className="flex flex-col gap-2 items-center">

              <input type="file" accept="image/*" className="hidden" id="avatar-upload" onChange={onFileChange} />

              <label 
                htmlFor="avatar-upload" 
                className="pixel-box w-full cursor-pointer bg-slate-800 hover:bg-slate-700 font-vt323 px-3 py-2 text-center text-slate-300">
                  {selectedFile ? "Change File" : "Choose Image"}
              </label>

              <button 
                className="pixel-box bg-indigo-600" 
                onClick={onFileUpload} 
                disabled={uploading}
                className="pixel-box w-full bg-indigo-600 hover:bg-indigo-500 px-3 py-2 disabled:bg-slate-800 disabled:opacity-50 text-white font-vt323">
                  {uploading ? "Uploading..." : "Upload image"}
              </button>
              
              <p className="text-xl font-vt323 text-slate-400 truncate text-overflow: ellipsis">
                {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
              </p>
            </div>
          </div>

          <div className="ml-8 font-vt323 text-2xl text-slate-400 py-5 flex flex-col gap-6">
            <div>
              <p className="font-press-start">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</p>
              <p>{user.bio}</p>
            </div>
            
            <div className="text-slate-600">
              <p>User ID: {user._id}</p>
              <p>Joined {new Date(user.date_joined).toLocaleDateString('en-UK', {month:'long', day:'numeric', year:'numeric'})}</p>
            </div>

          </div>
        </div>
      </div>
      

    </div>
  );


}