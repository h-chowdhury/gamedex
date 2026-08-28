import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema ( 
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    action: {
      type: String,
      enum: ['plan_to_play', 'playing', 'replaying', 'paused', 'completed', 'dropped'],
      required: true
    },

    game_id: {
      type: String,
      required: true
    },

    gameData: {
      name: {type: String},
      background_image: {type: String}
    },

    details: {
      oldStatus: { type: String },
      newStatus: { type: String }
    },

    createdAt: { 
      type: Date, default: Date.now 
    }
  }
);

const Activity = mongoose.model("Activity", activitySchema)
export { Activity };