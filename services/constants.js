export const GAME_STATUS = Object.freeze({
  WANT_TO_PLAY: 'plan_to_play',
  PLAYING: 'playing',
  REPLAYING: 'replaying',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
});

export const FETCH_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
});