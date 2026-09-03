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

export const GENRES = Object.freeze({
  ACTION: 'action',
  INDIE: 'indie',
  ADVENTURE: 'adventure',
  RPG: 'role-playing-games-rpg',
  STRATEGY: 'strategy',
  SHOOTER: 'shooter',
  CASUAL: 'casual',
  SIMULATION: 'simulation',
  PUZZLE: 'puzzle',
  ARCADE: 'arcade',
  PLATFORMER: 'platformer',
  MASSIVELY_MULTIPLAYER: 'massively-multiplayer',
  RACING: 'racing',
  SPORTS: 'sports',
  FIGHTING: 'fighting',
  FAMILY: 'family',
  BOARD_GAMES: 'board-games',
  EDUCATIONAL: 'educational',
  CARD: 'card'
});

export const ACTION_MAP = Object.freeze({
    "playing": "Is playing",
    "plan_to_play": "Plans to play",
    "completed": "Completed",
    "replaying": "Is replaying",
    "dropped": "Has dropped",
    "removed": "Has removed",
    "paused": "Has paused playing"
});

export const STATUS_MAP = Object.freeze({
    "playing": "Playing",
    "plan_to_play": "Planning",
    "completed": "Completed",
    "replaying": "Replaying",
    "dropped": "Dropped",
    "paused": "Paused"
});

export const STAR_MAP = Object.freeze({
  "0": "☆☆☆☆☆",
  "1": "★☆☆☆☆",
  "2": "★★☆☆☆",
  "3": "★★★☆☆",
  "4": "★★★★☆",
  "5": "★★★★★",
})

export const STATUS_COLOURS = Object.freeze ({
    [GAME_STATUS.PLAYING]: 'bg-[#83c5be]', 
    [GAME_STATUS.WANT_TO_PLAY]: 'bg-[#3a86ff]', 
    [GAME_STATUS.COMPLETED]: 'bg-[#f4a261]',    
    [GAME_STATUS.REPLAYING]: 'bg-[#e9c46a]',   
    [GAME_STATUS.PAUSED]: 'bg-[#e76f51]',     
    [GAME_STATUS.DROPPED]: 'bg-[#d62828]',  
    default: 'bg-[#83c5be]'
});