class Triangle
  
  def initialize (file)
    @file = file
  end
  
  def get_array
    File.open(@file, 'r') do |f|
      f.each_line.map do |row|
        row.split(' ').map { |x| x.to_i }
      end
    end
  end

  def calculate
    result = get_array.reverse
    result.each_with_index do |row, i|
      row.each_with_index do |num, j|
        if i > 0
          previous_row = result[i - 1]
          row[j] += [previous_row[j], previous_row[j + 1]].max
        end
      end
    end
    result.last.last
  end
end

puts Triangle.new('triangle.txt').calculate