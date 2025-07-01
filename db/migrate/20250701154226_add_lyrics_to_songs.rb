class AddLyricsToSongs < ActiveRecord::Migration[8.0]
  def change
    add_column :songs, :lyrics, :text
  end
end
