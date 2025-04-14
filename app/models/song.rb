class Song < ApplicationRecord
  belongs_to :playlist

  validates :bpm, numericality: { greater_than: 0 }
end
