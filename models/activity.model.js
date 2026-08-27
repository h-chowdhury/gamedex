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
      enum: ['PLANS_TO_PLAY_GAME', 'PLAYING_GAME', 'COMPLETED_GAME', 'REPLAYING_GAME', 'PAUSED_GAME', 'DROPPED_GAME'],
      required: true
    },

    game_id: {
      type: String,
      required: true
    },

    game_data: {
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