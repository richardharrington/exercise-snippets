// The "grid" in this program is not exactly a 2D array,
// it's a sparse matrix in the form of a 2D hash table. 
// Only cells that are alive, and their immediate neighbors, 
// are represented in the grid.

;

var LIFE = (typeof LIFE !== 'undefined') ? LIFE : {};
LIFE.main = (typeof LIFE.main !== 'undefined') ? LIFE.main : 

(function() {
    
  var config = LIFE.config;
  
  var isEmpty,
      Grid, Cell,
      grid, canvas, userSpeed, interval,
      setEventHandlers, runLife, init;
  
  // ------- UTILITY FUNCTIONS (actually, there's only one) -----
  
  isEmpty = function( obj ) {
    for (var p in obj) {
      if (obj.hasOwnProperty( p )) {
        return false;
      }
    }
    return true;
  };
  
  // ------- THE CELL AND GRID OBJECT LOGIC ------------

  Cell = function( x, y ) {
    this.x = x;
    this.y = y;
    
    // No need to initialize this.alive = false;
    // It will be undefined and therefore falsy 
    // whenever we need to check it.
  };
  
  Cell.prototype.comeToLife = function() {
    this.alive = true;
  };

  Cell.prototype.die = function() {
    this.alive = false;
  }

  Cell.prototype.iterateThroughNeighbors = function( action ) {
    var xOffset, yOffset,
        x = +this.x, 
        y = +this.y;

    for (xOffset = -1; xOffset <= 1; xOffset++) {
      for (yOffset = -1; yOffset <= 1; yOffset++) {
        
        // Don't count the "this" cell.
        if (xOffset !== 0 || yOffset !== 0) {
          action( x + xOffset, y + yOffset );          
        }
      }
    }
  };

  Cell.prototype.numberOfNeighbors = function( grid ) {
    var number = 0;
    this.iterateThroughNeighbors( function( checkX, checkY ) {
      var checkCell = grid.cellAt( checkX, checkY );
      if (checkCell && checkCell.alive) {
        number++;
      }
    });
    return number;
  };

  Cell.prototype.activateNeighbors = function( grid ) {
    
    // Even though they're not alive yet, all the cell's neighbors that don't
    // already exist need to be created, so that they will be checked in 
    // the subsequent round to see if they should come alive.
    
    this.iterateThroughNeighbors( function( newX, newY ) {
      if (!grid.cellAt( newX, newY )) {
        grid.add( new Cell( newX, newY ));
      }
    });
  };

  Cell.prototype.setFate = function( grid ) {
    var num = this.numberOfNeighbors( grid );
    this.willLive = this.alive ? (num === 2 || num === 3) : (num === 3);
  };
  

  Grid = function( plan, width, height ) {
    this.init( plan, width, height );
  };

  Grid.prototype.iterate = function( action ) {
    var x, y;
    for (x in this) {
      if (this.hasOwnProperty( x )) {
        for (y in this[x]) {
          if (this[x].hasOwnProperty( y )) {
            action( this[x][y] );
          }
        }
      }
    }
  };
  
  Grid.prototype.cellAt = function( x, y ) {
    return this[x] && this[x][y];
  };

  Grid.prototype.add = function( cell ) {
    var x = cell.x, y = cell.y;
    this[x] = this[x] || {};
    this[x][y] = cell;
  };

  Grid.prototype.clearDeadwood = function() {
    var self = this;
    var column;

    this.iterate( function( cell ) {
      var x = cell.x, y = cell.y;
      if (!cell.alive && cell.numberOfNeighbors( self ) === 0) {
        delete self[x][y];
      }
    });
    
    for (column in this) {
      if (isEmpty( this[column] )) {
        delete this[column];
      }
    }
  };
  
  Grid.prototype.step = function() {
    var self = this;

    // Who lives and who dies
    this.iterate( function( cell ) {
      cell.setFate( self );
    });

    // Execute fates
    this.iterate( function( cell ) {
      if (cell.willLive) {
        cell.comeToLife();
        cell.activateNeighbors( self );
      } else {
        cell.die();
      }
    });

  };
  
  Grid.prototype.init = function( fieldWidth, fieldHeight, planWidth, planHeight, planArray ) {
    var x, y;
    var cell;
    var left, top;
    var planWidth = planArray ? planArray[0].length : config.PLAN_WIDTH;
    var planHeight = planArray ? planArray.length : config.PLAN_HEIGHT;

    // Center it in the field.
    left = Math.floor( fieldWidth/2 - planWidth/2);
    top = Math.floor( fieldHeight/2 - planHeight/2);
    
    for (var y = 0; y < planHeight; y++) {
      for (var x = 0; x < planWidth; x++) {
        
        // If we've been passed a planArray, check whether the element is starred,
        // Otherwise pick a random number.
        
        if ( (planArray && (planArray[y][x] === '*')) || ((!planArray) && (0.6 < Math.random())) ) {
          cell = new Cell( left + x, top + y);
          cell.comeToLife();
          this.add( cell );
          cell.activateNeighbors( this );
        }
      }
    }
  };
  
  ////// --- THE DISPLAY ---------------------------
  
  canvas = {
    
    init: function( element, cellsWide, cellsHigh, cellSize, gridColor, deadColor, liveColor ) {
      var x, y;
      var c = element.getContext( "2d" );
      
      this.c = c;
      this.cellsWide = cellsWide;
      this.cellsHigh = cellsHigh;
      this.cellSize = cellSize;
      this.gridColor = gridColor;
      this.deadColor = deadColor;
      this.liveColor = liveColor;
      
      // Create gridColor grid
      c.fillStyle = gridColor;
      c.fillRect( 0, 0, element.width, element.height );

      // Make cells deadColor
      for (x = 0; x < cellsWide; x++) {
        for (y = 0; y < cellsHigh; y++) {
          this.fillCell( x, y, deadColor );
        }
      }
            
    },
    
    fillCell: function( x, y, color ) {
      var c = this.c;
      var cellSize = this.cellSize;
      c.fillStyle = color;
      c.fillRect( x*cellSize + 1, y*cellSize + 1, cellSize - 1, cellSize - 1 );
    },
    
    refresh: function( grid ) {
      var self = this;
      var cellsWide = this.cellsWide,
          cellsHigh = this.cellsHigh;
      var deadColor = this.deadColor, 
          liveColor = this.liveColor;
      
      grid.iterate( function( cell) {
        var x = cell.x, y = cell.y;
        if (x >= 0 && y >= 0 && x < cellsWide && y < cellsHigh) {
          self.fillCell( x, y, (cell.alive ? liveColor : deadColor) );
        }
      });
    }
  };
  
  userSpeed = {
    get: function() {
      return parseFloat( document.getElementById( 'speed' ).value );
    },
    set: function( val ) {
      document.getElementById( 'speed' ).value = val;
    }
  };
  
  runLife = function ( grid, speed ) {
    canvas.refresh( grid );

    interval = setInterval( function() {
      grid.clearDeadwood();
      grid.step();
      canvas.refresh( grid );
    }, Math.floor( 1000 / speed ) );
  };

  setEventHandlers = function( grid ) {
    
    var changeSpeed = function() {
      var speed;
      clearInterval( interval );
      speed = userSpeed.get();
      userSpeed.set( speed );
      runLife( grid, speed );
    }
    
    document.getElementById( 'speedbutton' ).onclick = function() {
      changeSpeed();
    };

    document.getElementById( 'speed' ).onkeydown = function( event ) {

      // cross-browser compliance for different keydown event key code property names    
      var code = event.keyCode || event.which;
      if (code === 13) {
        event.preventDefault();
        changeSpeed();
      }
    };
  };
  
  init = function() {
    
    // We're checking to see if userSpeed is already there --
    // even though it's not in the initial html -- because Firefox
    // preserves its value through refreshes, which we like.
     
    if (!userSpeed.get()) {
      userSpeed.set( config.SPEED );
    }
    
    var canvasElement = document.getElementById( 'canvasGrid' );
    canvasElement.width = config.GRID_WIDTH * config.CELL_SIZE + 1;
    canvasElement.height = config.GRID_HEIGHT * config.CELL_SIZE + 1;

    // To start with specific initial conditions, pass a fifth argument to Grid:
    // an array of strings with spaces and asterisks

    grid = new Grid( config.GRID_WIDTH, 
                     config.GRID_HEIGHT,
                     config.PLAN_WIDTH,
                     config.PLAN_HEIGHT );   
                       
    canvas.init(     canvasElement, 
                     config.GRID_WIDTH, 
                     config.GRID_HEIGHT, 
                     config.CELL_SIZE,
                     config.GRID_COLOR, 
                     config.DEAD_COLOR, 
                     config.LIVE_COLOR );

    setEventHandlers( grid );
    runLife( grid, userSpeed.get() );
    
  };


  // ------- MAKE IT SO ----------------

  init();
  
  // ---- module interface for debugging -----
  
  return { 
    grid: grid,
    canvas: canvas,
    interval: interval
  };
    
})();


