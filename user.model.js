import mongoose from 'mongoose';
import bcrypt from 'bycrypt';

const userSchema = new mongoose.Schema ({

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: "user"
  },

  date_joined: {
    type: Date,
    default: Date.now
  },
  
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true
  },

  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
    minlength: 3
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  avatar: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/10.x/pixel-art/svg?seed=${this.username}`;
    }
  },

  bio: {
    type: String,
    default: "Hello! I'm using GameDex."
  }

});

// hash password
saltRounds = 10;
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// create model
const User = mongoose.model("User", userSchema)
module.exports = User;