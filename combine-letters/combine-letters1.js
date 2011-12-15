// Version 1.

var combineLetters = function( letterArray ) {
    var result = [];
    var cache = {};
    
    (function buildWords( word, array ) {
        var c, i, len, rest;
        
        if (array.length == 1) {
            word += array[0];
            if (!cache[ word ]) {
                result.push( word );
                cache[ word ] = true;
            }
        } else {
          
            // extract each letter from the array in turn,
            // add it to the word that's getting bigger with
            // each deeper level of recursion,
            // and recur with that new intermediate word on the remaining letters

            for (i = 0, len = array.length; i < len; i += 1) {
                rest = array.slice();
                c = rest.splice( i, 1 );     // modifies rest.
                buildWords( word + c, rest );
            }
        }
    })( "", letterArray );
    
    return result.sort();
};


// -----------------------------------
// and here are some helper functions to demonstrate.

var rearrange = function( word, allSizeWords ) {
    return combineLetters( word.split(""), allSizeWords );
};

var getAndPrint = function() {
    var str = prompt( "Type in a word:" );
    if (str) {
        alert( rearrange( str, true ).join( "\n") ); // change true to false here to get only full-length words
        return true;
    }
    return false;
};

while (getAndPrint());

