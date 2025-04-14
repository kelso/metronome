class Playlist < ApplicationRecord
  has_many :songs, dependent: :destroy
end
