# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Playlist.destroy_all

gig1 = Playlist.create!(name: "Gig 1")
gig2 = Playlist.create!(name: "Gig 2")

gig1.songs.create!([
  { name: "Song 1", bpm: 110, time_signature: "4/4" },
  { name: "Song 2", bpm: 130, time_signature: "3/4" },
  { name: "Song 3", bpm: 90, time_signature: "6/8" }
])

gig2.songs.create!([
  { name: "Rock Intro", bpm: 120, time_signature: "4/4" },
  { name: "Blues Jam", bpm: 100, time_signature: "12/8" }
])

puts "Seeded #{Playlist.count} playlists and #{Song.count} songs."
