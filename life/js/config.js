;

var LIFE = (typeof LIFE !== 'undefined') ? LIFE : {};
LIFE.config = (typeof LIFE.config !== 'undefined') ? LIFE.config : 

{
  PLAN_WIDTH: 30,
  PLAN_HEIGHT: 15,
  GRID_WIDTH: 90,
  GRID_HEIGHT: 50,
  CELL_SIZE: 10,
  SPEED: 4,
  GRID_COLOR: '#BEB',
  DEAD_COLOR: '#CFC',
  LIVE_COLOR: '#085',
  
  // PREFAB_PLAN is not currently used (we're just setting up
  // a random plan instead). This is just an example. To put it into
  // use, pass it to the grid.init method in main.js.
  
  // This particular prefab plan is a glider pattern. It will 
  // move diagonally across the canvas in one direction.

  PREFAB_PLAN: [
    " * ",
    "  *",
    "***"
  ]
};