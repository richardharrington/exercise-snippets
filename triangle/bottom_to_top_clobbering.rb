class Triangle
  
  def read_file
    arr_num = File.open('triangle.txt','r') do |f|
      f.each_line.collect do |line|
        line.split(' ').collect{ |x| x.to_i}
      end
    end
  end

  def cal
    result = read_file.reverse
    result.each_with_index do |line, l_index|
      line.each_with_index do |element, e_index|
        if l_index > 0
          previous_line = result[l_index - 1]
          line[e_index] += previous_line[e_index] > previous_line[e_index + 1] ? previous_line[e_index] : previous_line[e_index + 1]
        end
      end
    end
    result.last.last
  end
end

puts Triangle.new.cal