const APIURL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

const registerUser = async (email, username, password) => {
  try {
    const res = await fetch(`${APIURL}/api/signup`, {
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

    const res = await fetch(`${APIURL}/api/login`, {
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
  const token = sessionStorage.getItem('token');
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