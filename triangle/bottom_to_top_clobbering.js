var fs = require('fs');

var max = function (file) {
  
  var text = fs.readFileSync(file, 'ascii');
  var array = text.split('\n').map(function(row) {
    return row.trim().split(' ').map(function(word) {
      return parseInt(word);
    });
  });
  
  array.reverse();
  array.forEach(function(row, i) {
    row.forEach(function(num, j) {
      if (i > 0) {
        var previousRow = array[i - 1];
        row[j] += Math.max(previousRow[j], previousRow[j + 1]);
      }
    });
  });
  
  return array[array.length - 1][0];
}  

console.log(max('triangle.txt'));
