// Add shift and unshift to the Array prototype, as if they didn't exist.

// Give them new names, so that the standard versions
// will still be there and we can compare them to our new ones.

var transfer = function( arrayFrom, arrayTo, howManyNotToTransfer ) {
    var i = arrayFrom.length;
    while (i > howManyNotToTransfer) {
        i--;
        arrayTo.push( arrayFrom.pop() );
    }
};

Array.prototype.newShift = function() {
    var tempStack = [];
    var result;
    
    transfer( this, tempStack, 1);
    result = this.pop();
    transfer( tempStack, this, 0);
    return result;
};


Array.prototype.newUnshift = function( element ) {
    var tempStack = [];
    
    transfer( this, tempStack, 0);
    this.push( element );
    transfer( tempStack, this, 0);
};