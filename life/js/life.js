// The "grid" in this program is not exactly a 2D array,
// it's more of a 2D hash table. Only cells that are alive,
// and their immediate neighbors, are represented in the grid.

;
var LIFE = LIFE || (function() {
  
  // ------ THE CONFIG INFO -------------
  
  var config = {
    PLAN_WIDTH: 50,
    PLAN_HEIGHT: 30,
    CELL_SIZE: 10,
    
    // PREFAB_PLAN is not currently used (we're just setting up
    // a random plan instead). This is just an example. To put it into
    // use, pass it to the grid.init method below.

    PREFAB_PLAN: [
      " * ",
      "  *",
      "***"
    ]
  };
  
  // ------- UTILITY FUNCTION (actually, there's only one) -----
  
  var isEmpty = function( obj ) {
    for (var p in obj) {
      if (obj.hasOwnProperty( p )) {
        return false;
      }
    }
    return true;
  };
  
  // ------- THE CELL AND GRID OBJECT LOGIC ------------

  var Cell = function( x, y ) {
    this.x = x;
    this.y = y;
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


  var Grid = function( plan ) {
    this.init( plan );
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
    var column;
    var x = cell.x, y = cell.y;
    this[x] = this[x] || {};
    this[x][y] = cell;
  };

  Grid.prototype.step = function() {
    var grid = this;
    var column;

    // Who lives and who dies
    this.iterate( function( cell ) {
      cell.setFate( grid );
    });

    // Execute fates
    this.iterate( function( cell ) {
      if (cell.willLive) {
        cell.comeToLife();
        cell.activateNeighbors( grid );
      } else {
        cell.die();
      }
    });

    // Clear deadwood for memory management and program efficiency.
    this.iterate( function( cell ) {
      var x = cell.x, y = cell.y;
      if (!cell.alive && cell.numberOfNeighbors( grid ) === 0) {
        delete grid[x][y];
      }
    });
    
    for (column in grid) {
      if (isEmpty( grid[column] )) {
        delete grid[column];
      }
    }
  };
  
  Grid.prototype.init = function( planArray ) {
    var x, y;
    var cell;
    var width = planArray ? planArray[0].length : config.PLAN_WIDTH;
    var height = planArray ? planArray.length : config.PLAN_HEIGHT;
    
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        
        // If we've been passed a planArray, check whether the element is starred,
        // Otherwise pick a random number.
        
        if ( (planArray && (planArray[y][x] === '*')) || ((!planArray) && (0.6 < Math.random())) ) {
          cell = new Cell( x, y);
          cell.comeToLife();
          this.add( cell );
          cell.activateNeighbors( this );
        }
      }
    }
  };
  
  ////// --- THE DISPLAY ---------------------------
  
  var canvas = {
    
    init: function( element ) {
      var c = element.getContext( "2d" );
      var width = element.width;
      var height = element.height;
      
      c.fillStyle = '#FFF';
      c.fillRect( 0, 0, width, height );
            
      this.cellsWide = Math.floor( width / config.CELL_SIZE );
      this.cellsHigh = Math.floor( height / config.CELL_SIZE );
      
      this.c = c;
    },
    
    fillCell: function( x, y, color ) {
      var cellSize = config.CELL_SIZE;
      var startX, startY;
      var c = this.c;
      
      if (x >= 0 && y >= 0 && x < this.cellsWide && y < this.cellsHigh) {
        startX = x * cellSize;
        startY = y * cellSize;

        c.fillStyle = color;
        c.fillRect( startX, startY, cellSize, cellSize );
      }
    },
    
    refresh: function( grid ) {
      var x, y;
      var cell;
      
      for (x = 0; x < this.cellsWide; x++) {
        for (y = 0; y < this.cellsHigh; y++) {
          cell = grid.cellAt( x, y );
          this.fillCell( x, y, (cell && cell.alive) ? '#000' : '#FFF' );
        }
      }
    }
  };
  
  var userSpeed = {
    get: function() {
      return parseFloat( document.getElementById( 'speed' ).value );
    },
    set: function( val ) {
      document.getElementById( 'speed' ).value = val;
    }
  };
  
  var interval;
  
  var runLife = function ( grid, speed ) {
    canvas.refresh( grid );

    interval = setInterval( function() {
      grid.step();
      canvas.refresh( grid );
    }, Math.floor( 1000 / speed ) );
  };

  var setEventHandlers = function( grid ) {
    
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


  // ------- MAKE IT SO ----------------

  // Pass an array of strings with spaces and asterisks
  // here to start with specific initial conditions.
   
  var grid = new Grid( config.PREFAB_PLAN ); 
  canvas.init( document.getElementById( 'canvasGrid' ));
  
  setEventHandlers( grid );
  runLife( grid, userSpeed.get() );
  
  
  // ---- module interface for debugging -----
  
  return { 
    grid: grid,
    canvas: canvas,
    config: config,
    interval: interval
  };
    
})();


