/* 

This function takes an array of single-character strings and 
returns an array of strings containing all combinations of these
letters, with no duplicates.

The heart of it is the function 'recur' which carefully builds up 
words letter by letter and then cumulatively loads found words into 
an array contained in a closure, instead of returning values to previous 
iterations of itself as most recursive functions do. (The first version 
only does words of full length, i.e. the length of the array that is the 
argument of the main function. Then there is a second version that has 
the option of doing smaller words.)

So it's a little different and more complicated (for me) than classic 
uses of recursion such as looking through nodes of a tree. Like all 
recursive functions, though, it sifts through data to finer and finer 
levels until it gets to the finest, at which point it does its thing 
and exits without recurring again, thus backing up a level. This is 
the <if> statement. The <else> statement is where the sifting through 
the data and the recursive call happens.

Using the version where it compiles all sizes of words (or all sizes 
of two letters or greater), it wouldn't take too much more effort to 
turn this into a very simple way to cheat in Boggle, or Scrabble, and 
I discovered a blog post by John Resig about this exact topic (well, 
not cheating, but searching dictionaries). Ajax calls to dictionary 
websites to check each of the words individually would be too time-
consuming, but there are a few places easily available on the Internet 
where the Scrabble dictionary is posted as a text file, so you can 
just download that to the client once (it's about 1 MB), and then 
you're good to go.

*/

// version 1 is (I think) the original interview problem,
// and only returns words of length letterArray.length.

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
// version 2 adds the option to return words of all sizes.
// Has the same effect as version 1 if you only pass it one 
// argument.


// In this version,
// I have replaced cache, result, and the code that checks
// them and sets them, with an object called "result." Now that there
// are two places in the code where words are added to the result,
// this "result" object helps to re-use code.

// This version of combineLetters has the same effect as the first version if you only pass one argument.

combineLetters = function( letterArray, allSizeWords ) {
    
    // allSizeWords is a boolean that tells us whether 
    // we want only words of length letterArray.length, 
    // or all size words up to that length.
            
    var allSizeWords = allSizeWords || false;
    
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
        
        if (array.length == 1) {
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

// to test, uncomment this line:

// while (getAndPrint());

