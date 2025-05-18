class Asset < ApplicationRecord
  include RankedModel

  belongs_to :song
  has_one_attached :file

  ranks :row_order, with_same: :song_id
end
