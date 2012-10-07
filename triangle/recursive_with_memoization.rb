class Triangle
  
  def initialize(file)
    @file = file
  end
  
  def get_array(file)
    text = File.open(file, 'r').read
    text.each_line.map do |line|
      line.strip().split(' ').map do |n|
        { :num => n.to_i }
      end
    end
  end
  
  def get_root(array)
    array.each_with_index do |row, i|
      row.each_with_index do |node, j|
        next_row = array[i+1]
        unless next_row.nil?
          node[:left] = next_row[j]
          node[:right] = next_row[j+1]
        end
      end
    end
    array[0][0]
  end
  
  def walk_tree(node)
    return 0 if node.nil?
    return node[:memo_sum] unless node[:memo_sum].nil?
    node[:memo_sum] = node[:num] + [walk_tree(node[:left]), walk_tree(node[:right])].max
  end
  
  def get_max
    walk_tree( get_root( get_array( @file)))
  end
end

puts Triangle.new('triangle.txt').get_max