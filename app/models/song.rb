class Song < ApplicationRecord
  include RankedModel

  belongs_to :playlist

  ranks :row_order, with_same: :playlist_id

  validates :bpm, numericality: { greater_than: 0 }
end
