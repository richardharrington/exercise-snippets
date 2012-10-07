var fs = require('fs');

var max = function (file) {
  
  var array = fs.readFileSync(file, 'ascii').split('\n').map(function(row) {
    return row.trim().split(' ').map(function(word) {
      return parseInt(word);
    });
  });
  
  return array.reduceRight(function(sumRow, row) {
    return row.map(function(num, i) {
      return num + Math.max(sumRow[i], sumRow[i + 1]);
    });
  })[0];
  
};

console.log(max('triangle.txt'));