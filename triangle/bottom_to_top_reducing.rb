class Triangle
  
  def initialize (file)
    @file = file
  end
  
  def get_array
    File.open(@file, 'r') do |f|
      f.each_line.map do |row|
        row.split(' ').map { |num| num.to_i }
      end
    end
  end

  def calculate
    result = get_array.reverse.reduce do |sum_row, row|
      row.map.with_index do |num, i|
        num + [sum_row[i], sum_row[i + 1]].max
      end
    end
    result[0]
  end

end

puts Triangle.new('triangle.txt').calculate