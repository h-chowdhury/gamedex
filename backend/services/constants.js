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

export const STATUS_COLOURS = Object.freeze({
  [GAME_STATUS.PLAYING]: '#4b80ca', 
  [GAME_STATUS.WANT_TO_PLAY]: '#68c2d3', 
  [GAME_STATUS.COMPLETED]: '#a2dcc7',    
  [GAME_STATUS.REPLAYING]: '#ede19e',   
  [GAME_STATUS.PAUSED]: '#d3a068',     
  [GAME_STATUS.DROPPED]: '#b45252',  
  default: '#83c5be'
});

export const STATUS_COLOURS_LOW = Object.freeze({
  [GAME_STATUS.PLAYING]: '#4b80ca4D', 
  [GAME_STATUS.WANT_TO_PLAY]: '#68c2d34D', 
  [GAME_STATUS.COMPLETED]: '#a2dcc74D',    
  [GAME_STATUS.REPLAYING]: '#ede19e4D',   
  [GAME_STATUS.PAUSED]: '#d3a0684D',     
  [GAME_STATUS.DROPPED]: '#b452524D',  
  default: '#83c5be4D'
});