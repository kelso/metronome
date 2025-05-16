class AddRowOrderToSongs < ActiveRecord::Migration[8.0]
  def change
    add_column :songs, :row_order, :integer
  end
end
