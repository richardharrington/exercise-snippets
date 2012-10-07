fs = require 'fs'

max = (file) ->
  
  text = fs.readFileSync(file, 'ascii')
  array = text.split('\n').map (row) ->
    row.trim().split(' ').map (word) ->
      parseInt word
      
  result = array.reduceRight (sumRow, row) ->
    row.map (num, i) ->
      num + Math.max sumRow[i], sumRow[i + 1]
  
  result[0]
  
console.log max 'triangle.txt'