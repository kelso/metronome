class Playlist < ApplicationRecord
  has_many :songs, dependent: :destroy

  def duplicate!
    self.class.transaction do
      duplicated_playlist = self.class.create!(name: duplicate_name)

      songs.rank(:row_order).each do |song|
        duplicated_song = duplicated_playlist.songs.create!(
          name: song.name,
          bpm: song.bpm,
          time_signature: song.time_signature,
          lyrics: song.lyrics,
          row_order: song.row_order
        )

        song.assets.rank(:row_order).each do |asset|
          duplicated_asset = duplicated_song.assets.create!(
            name: asset.name,
            row_order: asset.row_order
          )
          duplicated_asset.file.attach(asset.file.blob) if asset.file.attached?
        end
      end

      duplicated_playlist
    end
  end

  private

  def duplicate_name
    base_name = "#{name} (copy)"
    return base_name unless self.class.exists?(name: base_name)

    copy_index = 2
    copy_name = "#{name} (copy #{copy_index})"

    while self.class.exists?(name: copy_name)
      copy_index += 1
      copy_name = "#{name} (copy #{copy_index})"
    end

    copy_name
  end
end
