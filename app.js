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
import { db } from "./models/index.js";
import { User } from "./models/user.model.js";
import { verifyToken} from "./services/authMiddleware.js";
import games from './mockGames.json' with {type:'json'};


// Variables  ***************************************************** //
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


// Database connection ******************************************** //
mongoose.connect(mongoDBURL)
  .then(() => console.log("Connection Successful"))
  .catch((err) => {
    console.error("Connection Error: ", err);
    process.exit(1);
  });


// Middleware  **************************************************** //
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    console.log(`User requested: ${req.method} to ${req.url}`);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Image storage configuration ************************************ //

router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message: 'No file uploaded.'});
    }

    const userId = req.user.id || req.user.userId || req.user._id;
    const avatarUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { returnDocument: 'after' },
      { runValidators: true }
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


// Routes  ******************************************************** //
app.get('/', (req, res) => {
  console.log(`Connected to Express & MongoDB Setup!`);
});


// Return singular match 
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

    // if (idOrSlug) {
    //   results = results.filter(
    //     (game) => (
    //       game.name.toLowerCase().includes(idOrSlug.toLowerCase()) || 
    //       game.slug.toLowerCase().includes(idOrSlug.toLowerCase()) || 
    //       game.id.includes(idOrSlug)
    //     )
    //   )
    // }

    return res.json(game);
  }

  // Live API fetch
  try {
    const response = await fetch(`https://api.rawg.io/api/games/${idOrSlug}?key=${rawgAPIkey}`);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const gameData = await response.json();
    // console.log("Name:", gameData.name);
    // console.log("Description:", gameData.description_raw);
    // console.log("Released:", gameData.released);
    // console.log("Image:", gameData.background_image);
    // return gameData;
    res.json(gameData);

  } catch (error) {
    console.error("Could not fetch game details:", error);
    res.json(null);
  }
});


// Return several matches
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
    const { search, page, genre } = req.query;

    const url = new URL('https://api.rawg.io/api/games');
    url.searchParams.append('key', rawgAPIkey);

    if (search) url.searchParams.append('search', search);
    if (page) url.searchParams.append('page', page);
    if (genre) url.searchParams.append('genres', genre);

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


app.get('/users/me', verifyToken, async (req, res) => {
  const userId = req.user.id || req.user.userId || req.user._id;
  const user = await User.findById(userId).select('-password');
  res.json(user);
});


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
        console.log("Email already registered.");
        newErrors.email = 'Email already registered.';
      }
      if (existingUsername) {
        console.log("Username is taken.");
        newErrors.username = 'Username is taken.';
      }

      console.log(newErrors.email);
      console.log(newErrors.username);
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
      console.log("Password is incorrect.");
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
