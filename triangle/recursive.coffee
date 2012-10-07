fs = require 'fs'

max = (file) ->
  
  text = fs.readFileSync('triangle.txt', 'ascii')
  array = text.split('\n').map (row) ->
    row.trim().split(' ').map (word) ->
      num: parseInt word
    
  array.forEach (row, i) ->
    row.forEach (node, j) ->
      next_row = array[i+1]
      if next_row?
        node.left = next_row[j]
        node.right = next_row[j+1]
        
  root = array[0][0]
  do walk_tree = (node = root) ->
    return 0 unless node?
    return node.memo_sum if node.memo_sum?
    node.memo_sum = node.num + Math.max (walk_tree node.left), (walk_tree node.right)

console.log max 'triangle.txt'