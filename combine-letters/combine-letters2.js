// Version 2.

combineLetters = function( letterArray, allSizeWords ) {
    
    // allSizeWords is a boolean that tells us whether 
    // we want only words of length letterArray.length, 
    // or all size words up to that length.
            
    var allSizeWords = allSizeWords || false;
    
    // I have replaced cache, result, and the code that checks
    // them and sets them, from version 1, with an object called "result." Now that there
    // are two places in the code where words are added to the result,
    // this "result" object helps to re-use code.

    var result = {
        words: [],
        cache: {},
        add: function( word ) {
            if (!this.cache[ word ]) {
                this.words.push( word );
                this.cache[ word ] = true;
            }
        }
    };
    
    (function buildWords( partialWord, array ) {
        var c, i, len, rest;
        var resultWord;
        
        if (array.length === 1) {
            resultWord = partialWord + array[0];
            result.add( resultWord );
        } else {

            // extract each letter from the array in turn,
            // add it to the word that's getting bigger with
            // each deeper level of recursion,
            // and recur with that new intermediate word on the remaining letters

            for (i = 0, len = array.length; i < len; i += 1) {
                rest = array.slice();
                c = rest.splice( i, 1 );     // modifies rest.
                
                // the boolean argument allSizeWords tells 
                // the function whether we want to include
                // shorter words in the array of results or not.
                
                resultWord = partialWord + c;
                if (allSizeWords) {
                    result.add( resultWord );
                }
                buildWords( resultWord, rest );
            }
        }
        
    })( "", letterArray );
    
    // list them first by word length, 
    // then alphabetically
    
    return result.words.sort( function( a, b ) {
      
        var lengthDif = a.length - b.length;
        if (lengthDif !== 0) return lengthDif;
        
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
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

