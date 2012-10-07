fs = require 'fs'

max = (file) ->
  
  text = fs.readFileSync(file, 'ascii')
  array = text.split('\n').map (row) ->
    row.trim().split(' ').map (word) ->
      parseInt word
  
  array.reverse().forEach (row, i, arr) ->
    row.forEach (num, j) ->
      if i > 0
        previous_row = arr[i - 1]
        row[j] += Math.max previous_row[j], previous_row[j + 1]
        
  array[array.length - 1][0]

console.log max('triangle.txt')