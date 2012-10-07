fs = require 'fs'

max = (file) ->
  
  array = ((parseInt word for word in row.trim().split(' ')) for row in fs.readFileSync(file, 'ascii').split('\n'))
  
  result = array.reduceRight (sumRow, row) ->
    num + Math.max sumRow[i], sumRow[i + 1] for num, i in row
  
  result[0]
  
console.log max 'triangle.txt'