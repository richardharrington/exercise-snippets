fs = require 'fs'

max = (file) ->
  
  text = fs.readFileSync('triangle.txt', 'ascii')
  array = text.split('\n').map (row) ->
    row.trim().split(' ').map (word) ->
      parseInt word
  
  array.reverse().forEach (row, i) ->
    row.forEach (num, j) ->
      next_row = array[i + 1]
      next_num = row[j + 1]
      if next_row? and next_num?
        next_row[j] += if num > next_num then num else next_num
        
  array[array.length - 1][0]

console.log max('triangle.txt')