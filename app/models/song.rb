class Song < ApplicationRecord
  include RankedModel

  belongs_to :playlist
  has_many :assets, dependent: :destroy

  ranks :row_order, with_same: :playlist_id

  validates :bpm, numericality: { greater_than: 0 }
end
