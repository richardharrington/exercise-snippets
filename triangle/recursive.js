var fs = require('fs');

var max = function (file) {
  
  var text = fs.readFileSync(file, 'ascii');
  var array = text.split('\n').map(function(row) {
    return row.trim().split(' ').map(function(word) {
      return { num: parseInt(word) };
    });
  });
  
  array.forEach(function(row, i) {
    row.forEach(function(node, j) {
      var next_row = array[i+1];
      if (next_row) {
        node.left = next_row[j];
        node.right = next_row[j+1];
      };
    });
  });
  var root = array[0][0];
  
  return (function walk_tree(node) {
    if (!node) return 0;
    if (typeof node.memo_sum !== 'undefined') return node.memo_sum;
    node.memo_sum = node.num + Math.max(walk_tree(node.left), walk_tree(node.right));
    return node.memo_sum;
  })(root);
  
}  

console.log(max('triangle.txt'))