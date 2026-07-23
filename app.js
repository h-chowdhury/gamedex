import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db } from "./models/index.js";
import { User } from "./models/user.model.js";

// load environment variables
dotenv.config();
const app = express();

const port = process.env.PORT || 5000;
const mongoDBURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/gamedex';
const rawgAPIkey = process.env.RAWG_API_KEY;
// const JWT_SECRET = process.env.JWT_SECRET;

// const gameID = 4200;
// const gameURL = `https://api.rawg.io/api/games/${gameID}?key=${rawgAPIkey}`;

// Database connection
mongoose.connect(mongoDBURL)
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.error("Connection Error: ", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    console.log(`User requested: ${req.method} to ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => {
  console.log(`Connected to Express & MongoDB Setup!`);
});

app.get('/api/game/:idOrSlug', async (req, res) => {
  // fetch(`https://api.rawg.io/api/games?key=${rawgAPIkey}`)
  // .then(response => response.json())
  // .then(data => console.log(data))
  // .catch(error => console.error(error));

  try {
    const idOrSlug = req.params.idOrSlug;
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

app.post('/signup', async (req, res) => {

  try {
    const { email, username, password } = req.body;

    // check for missing fields
    if (!email || !username || !password) {
      return res.status(400).json({error: "All fields are required."});
    }

    // check if email/username exists
    const existingUsername = await User.findOne({username});
    const existingEmail = await User.findOne({email});

    if (existingEmail || existingUsername) {
      if (existingEmail) {
        console.log("Email already registered.");
      }
      if (existingUsername) {
        console.log("Username is taken.");
      }
      return res.status(400).json({
        error: "Invalid email or username."
      });
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

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
