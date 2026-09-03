import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { User } from "./models/user.model.js";
import { UserGame } from "./models/usergame.model.js";
import { Activity } from "./models/activity.model.js";
import { verifyToken} from "./services/authMiddleware.js";
import games from './mockGames.json' with {type:'json'};


// Variables  ************************************************************ //
const USE_MOCK_DATA = false;

dotenv.config();
const app = express();
const router = express.Router();

const port = process.env.PORT || 5000;
const mongoDBURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/gamedex';
const rawgAPIkey = process.env.RAWG_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// creates folder for photo uploads if not existing
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// initiates storage for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, ("uploads/"));
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },  
});
const upload = multer({storage})


// const JWT_SECRET = process.env.JWT_SECRET;
// const gameID = 4200;
// const gameURL = `https://api.rawg.io/api/games/${gameID}?key=${rawgAPIkey}`;


// Database connection *************************************************** //
mongoose.connect(mongoDBURL)
  .then(() => console.log("Connection Successful"))
  .catch((err) => {
    console.error("Connection Error: ", err);
    process.exit(1);
  });


// Middleware  *********************************************************** //
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    console.log(`User requested: ${req.method} to ${req.url}`);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Image storage configuration ******************************************* //

router.put('/update-profile', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;
    const { username, bio } = req.body;

    const updateData = {};

    if (username !== undefined && username.trim() !== '') {
      updateData.username = username.toLowerCase().trim();
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: 'after' },
      { new: true, runValidators: true }
    ).select('-password');

    console.log(updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

app.use('/profile', router);


// Routes **************************************************************** //
app.get('/', (req, res) => {
  console.log(`Connected to Express & MongoDB Setup!`);
});


// Return singular game match ******************************************** //
app.get('/api/game/:idOrSlug', async (req, res) => {

  const idOrSlug = req.params.idOrSlug;

  // Local data fetch (if API is down)
  if (USE_MOCK_DATA) {
    const game = games.games.find(
      (g) => g.id.toString() === idOrSlug || g.slug === idOrSlug.toLowerCase()
    );

    if (!game) {
      return res.status(404).json({ detail: "Game not found." });
    }

    return res.json(game);
  }

  // Live API fetch
  try {
    const response = await fetch(`https://api.rawg.io/api/games/${idOrSlug}?key=${rawgAPIkey}`);

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `RAWG API returned status ${response.status}` 
      });
    }

    const gameData = await response.json();
    res.json(gameData);

  } catch (error) {
    console.error("Could not fetch game details:", error);
    return res.status(500).json({ error: "Internal server error fetching game details." });
  }
});


// Return several game matches ******************************************* //
app.get('/api/games', async (req, res) => {

  const { search } = req.query;

  // Local data fetch (if API is down)
  if (USE_MOCK_DATA) {
    let results = mockDatabase.games;
    
    if (search) {
      results = results.filter((game) =>
        game.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return res.json({
      count: results.length,
      next: null,
      previous: null,
      results: results
    });
  }

  // Live API fetch
  try {
    const { search } = req.query;

    const url = new URL('https://api.rawg.io/api/games');
    url.searchParams.append('key', rawgAPIkey);

    if (search) url.searchParams.append('search', search);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `RAWG API error: ${response.statusText}` 
      });
    }

    const data = await response.json();

    return res.json(data);

  } catch (error) {
    console.error("Error fetching games:", error);
    return res.status(500).json({ error: "Failed to fetch games." });
  }
});


// Return trending, upcoming and popular games *************************** //

// trending
app.get('/api/games/trending', async (req, res) => {

  // local data fetch
  if (USE_MOCK_DATA) {
    return [];
  }

  // live API fetch
  try {
    const today = new Date().toISOString().split('T')[0];
    const pastDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 60 days ago

    const url = `https://api.rawg.io/api/games?key=${rawgAPIkey}&dates=${pastDate},${today}&ordering=-added&page_size=25`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch trending games from RAWG' });
    }

    const data = await response.json();
    console.log(data);
    res.json(data.results);

  } catch (error) {
    console.error("Error fetching trending games:", error)
    return res.status(500).json({ error: "Failed to fetch trending games." });
  }
});


// upcoming
app.get('/api/games/upcoming', async (req, res) => {

  // local data fetch
  if (USE_MOCK_DATA) {
    return [];
  }

  // live API fetch
  try {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 180 days in future

    const url = `https://api.rawg.io/api/games?key=${rawgAPIkey}&dates=${today},${futureDate}&ordering=released&page_size=25`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch upcoming games from RAWG' });
    }

    const data = await response.json();
    res.json(data.results);

  } catch (error) {
    console.error("Error fetching upcoming games:", error)
    return res.status(500).json({ error: "Failed to fetch upcoming games." });
  }
});


// popular
app.get('/api/games/popular', async (req, res) => {

  // local data fetch
  if (USE_MOCK_DATA) {
    return [];
  }

  // live API fetch
  try {
    const url = `https://api.rawg.io/api/games?key=${rawgAPIkey}&ordering=-added&page_size=25`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch popular games from RAWG' });
    }

    const data = await response.json();
    res.json(data.results);

  } catch (error) {
    console.error("Error fetching popular games:", error)
    return res.status(500).json({ error: "Failed to fetch popular games." });
  }
});


// top 40
app.get('/api/games/top-40', async (req, res) => {

  // local data fetch
  if (USE_MOCK_DATA) {
    return [];
  }

  // live API fetch
  try {
    const url = `https://api.rawg.io/api/games?key=${rawgAPIkey}&ordering=-rating&page_size=40`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch top games from RAWG' });
    }

    const data = await response.json();
    res.json(data.results);

  } catch (error) {
    console.error("Error fetching top games:", error)
    return res.status(500).json({ error: "Failed to fetch top games." });
  }
});


// Save game entry info ************************************************** //
app.post('/save-entry', async (req, res) => {
  try {
    const { userId, gameId, gameTitle, gameImage, gameReleased, gameGenres, formData } = req.body;

    if (!userId || !gameId) {
      return res.status(400).json({ message: "Missing required fields: userId and gameId." });
    }

    const existingEntry = await UserGame.findOne({ user: userId, game_id: gameId });
    const oldStatus = existingEntry ? existingEntry.status : null;
    const newStatus = formData?.status || 'plan_to_play';

    const sanitisedData = {
      ...formData,
      status: formData?.status || 'plan_to_play', 
    };

    const formattedGenres = gameGenres.map(g => (typeof g === 'object' ? g.name : g));

    // save UserGame entry
    const savedEntry = await UserGame.findOneAndUpdate(
      { user: userId, game_id: gameId },
      {
        user: userId,
        game_id: gameId,
        game_title: gameTitle,
        background_image: gameImage,
        released: gameReleased,
        genres: formattedGenres || [],
        ...sanitisedData
      },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true
      }
    );

    // log activity event
    if (!existingEntry || oldStatus !== newStatus) {
      await Activity.create({
        user: userId,
        action: newStatus,
        game_id: gameId,
        gameData: { name: gameTitle || 'Unknown Game', background_image: gameImage || '' },
        details: { oldStatus, newStatus }
      });
    }

    res.status(200).json({data: savedEntry });

  } catch (err) {
    console.error("Error saving game entry:", err);
    res.status(500).json({ message: err.message });
  }
});


// delete game entry info ************************************************** //
app.delete('/delete-entry', async (req, res) => {
  try {
    const { userId, gameId, gameTitle, gameImage } = req.body;

    if (!userId || !gameId) {
      return res.status(400).json({ message: "Missing userId or gameId" });
    }

    const existingEntry = await UserGame.findOne({ user: userId, game_id: gameId });

    if (!existingEntry) {
      return res.status(404).json({ message: "Game entry not found" });
    }

    await UserGame.findOneAndDelete({ user: userId, game_id: gameId });

    // log activity event
    await Activity.create({
      user: userId,
      action: 'removed',
      game_id: gameId,
      gameData: { 
        name: gameTitle || existingEntry.gameData?.name || 'Unknown Game', 
        background_image: gameImage || existingEntry.gameData?.background_image || '' 
      },
      details: { 
        oldStatus: existingEntry.status, 
        newStatus: null }
    });
  

    res.status(200).json({message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting entry:", err);
    res.status(500).json({ message: err.message });
  }
});


// Fetch game entry info ************************************************** //
app.get('/fetch-entry', async (req, res) => {
  try {
    const { userId, gameId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    if (gameId) {
      const game = await UserGame.findOne({ user: userId, game_id: String(gameId) });
      return res.status(200).json({ data: game });
    }

    const games = await UserGame.find({ user: userId });
    return res.status(200).json({ data: games });

    res.status(200).json({data: games});
  } catch (err) {
    console.error("Server error in /fetch-entry:", err);
    res.status(500).json({ message: err.message });
  }
});


// Return user data ****************************************************** //
app.get('/users/me', verifyToken, async (req, res) => {
  const userId = req.user.id || req.user.userId || req.user._id;
  const user = await User.findById(userId).select('-password');
  res.json(user);
});


// Return activity feed ************************************************** // 
app.get("/activity-feed/global", async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(activities);
    
  } catch (err) {
    console.error("CRASH inside /activity-feed/global:", err);
    res.status(500).json({ error: err.message });
  }
})


// Manage user registration ********************************************** //
app.post('/signup', async (req, res) => {

  try {
    const { email, username, password } = req.body;
    const newErrors = {};

    // check for missing fields
    if (!email || !username || !password) {
      return res.status(400).json({error: "All fields are required."});
    }

    // check if email/username exists, return if so
    const existingUsername = await User.findOne({username});
    const existingEmail = await User.findOne({email});

    if (existingEmail || existingUsername) {
      if (existingEmail) {
        newErrors.email = 'Email already registered.';
      }
      if (existingUsername) {
        newErrors.username = 'Username is taken.';
      }

      return res.status(400).json({ newErrors });
    } 

    // otherwise if email/username is unique
    // store user info
    const newUser = await User.create({
      email,
      username,
      password
    });

    console.log(`User registered successfully.`);

    // set up session/token & store in local storage
    const uid = newUser._id;
    const payload = {userId: uid , username , email};
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

    // return status
    res.status(200).json({
      message: "Register data valid.",
      token: token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }

});


// Manage user login ***************************************************** //
app.post('/login', async (req, res) => {

  try {
    const { username, password } = req.body;
    const newErrors = {};

    // check for missing fields
    if (!username || !password) {
      return res.status(400).json({error: "All fields are required."});
    }

    // check if username exists
    const user = await User.findOne({username}).select('+password');

    // return if username doesn't exist
    if (!user) {
      console.log("Username does not exist.");
      newErrors.username = 'Username does not exist.'
      return res.status(400).json({ newErrors });
    }

    // check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      newErrors.password = 'Password is incorrect'
      return res.status(400).json({ newErrors });
    }

    // return status
    const uid = user._id;
    const email = user.email;
    const payload = {userId: uid , username , email};
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});

    res.status(200).json({
      message: "Login successful.",
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
