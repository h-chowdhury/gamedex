// import mongoose from 'mongoose';

// mongoose.connect((process.env.DB_URL || 'mongodb://127.0.0.1:27017/gamedex'), {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then (() => {
//     console.log("Index.js connected to MongoDB");
//   })
//   .catch ((error) => {
//     console.error("Index.js error connecting to MongoDB", error);
//   });

// const db = {};

// db.mongoose = mongoose

// db.user = require("./user/model");

// module.exports = db;

import mongoose from 'mongoose';
import { User } from "./user.model.js";

const db = {
  mongoose: mongoose,
  User: User
};

export {db};