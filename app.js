import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const mongoDBURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/gamedex';
const rawgAPIkey = process.env.RAWG_API_KEY;
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
  res.send('<h1>Connected to Express & MongoDB Setup!</h1>');
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

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
