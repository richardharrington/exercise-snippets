// The "grid" in this program is not exactly a 2D array,
// it's more of a 2D hash table. Only cells that are alive,
// and their immediate neighbors, are represented in the grid.

;
var LIFE = LIFE || (function() {
  
  // ------ THE CONFIG INFO -------------
  
  var config = {
    PLAN_WIDTH: 30,
    PLAN_HEIGHT: 10,
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
  
  // The other variables
  
  var isEmpty,
      Grid, Cell,
      grid, canvas, userSpeed,
      canvasElement, width, height, interval,
      setEventHandlers, runLife;
  
  // ------- UTILITY FUNCTION (actually, there's only one) -----
  
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
  
  Grid.prototype.init = function( planArray, fieldWidth, fieldHeight ) {
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
    
    init: function( element, cellsWide, cellsHigh ) {
      this.c = element.getContext( "2d" );
      
      this.c.fillStyle = '#999';
      this.c.fillRect( 0, 0, element.width, element.height );
            
      this.cellsWide = cellsWide;
      this.cellsHigh = cellsHigh;
    },
    
    fillCell: function( x, y, color ) {
      var cellSize = config.CELL_SIZE;
      var startX, startY;
      
      if (x >= 0 && y >= 0 && x < this.cellsWide && y < this.cellsHigh) {
        startX = x * cellSize;
        startY = y * cellSize;

        this.c.fillStyle = color;
        this.c.fillRect( startX + 1, startY + 1, cellSize - 1, cellSize - 1 );
      }
    },
    
    refresh: function( grid ) {
      var x, y;
      var cell;
      
      for (x = 0; x < this.cellsWide; x++) {
        for (y = 0; y < this.cellsHigh; y++) {
          
          // Check for existence of grid because
          // we're also using this method to fill canvas with white squares
          // before we create the grid.
          
          cell = grid.cellAt( x, y );
          this.fillCell( x, y, (cell && cell.alive) ? '#000' : '#FFF' );
        }
      }
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


  // ------- MAKE IT SO ----------------

  canvasElement = document.getElementById( 'canvasGrid' );
  width = (canvasElement.width - 1) / config.CELL_SIZE;
  height = (canvasElement.height - 1) / config.CELL_SIZE;
  
  // Pass an array of strings with spaces and asterisks
  // here where it says "null" to start with specific initial conditions.
    
  grid = new Grid( null, width, height ); 
  canvas.init( canvasElement, width, height);
  
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


