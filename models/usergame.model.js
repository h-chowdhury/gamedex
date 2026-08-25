import mongoose from 'mongoose';

const userGameSchema = new mongoose.Schema (
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    game_id: {
      type: String,
      required: true,
      index: true,
    },

    game_title: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['plan_to_play', 'playing', 'completed', 'replaying', 'paused', 'dropped'],
      default: 'plan_to_play',
    },

    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    hours_played: {
      type: Number,
      min: 0,
      default: 0,
    },

    start_date: {
      type: Date,
      default: null,
    },

    finish_date: {
      type: Date,
      default: null,
    },

    total_replays: {
      type: Number,
      min: 0,
      default: 0,
    },

    favourite: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      trim: true,
      maxLength: 2000,
      default: '',
    },
  },

  {
    timestamps: true,
  }

);


// prevent duplicate entries
userGameSchema.index({ user: 1, game_id: 1 }, { unique: true });

// create model
const UserGame = mongoose.model("UserGame", userGameSchema)
export { UserGame };