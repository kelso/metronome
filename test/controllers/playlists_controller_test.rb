require "test_helper"

class PlaylistsControllerTest < ActionDispatch::IntegrationTest
  test "duplicates playlist with songs and assets" do
    playlist = Playlist.create!(name: "Practice")
    song = playlist.songs.create!(
      name: "Intro",
      bpm: 120,
      time_signature: "4/4",
      lyrics: "One\nTwo",
      row_order: 10
    )
    asset = song.assets.create!(name: "Click track", row_order: 20)
    asset.file.attach(
      io: StringIO.new("audio"),
      filename: "click.txt",
      content_type: "text/plain"
    )

    assert_difference -> { Playlist.count }, 1 do
      assert_difference -> { Song.count }, 1 do
        assert_difference -> { Asset.count }, 1 do
          post duplicate_playlist_path(playlist)
        end
      end
    end

    duplicated_playlist = Playlist.order(:created_at).last
    duplicated_song = duplicated_playlist.songs.first
    duplicated_asset = duplicated_song.assets.first

    assert_redirected_to playlist_path(duplicated_playlist)
    assert_equal "Practice (copy)", duplicated_playlist.name
    assert_equal "Intro", duplicated_song.name
    assert_equal 120, duplicated_song.bpm
    assert_equal "4/4", duplicated_song.time_signature
    assert_equal "One\nTwo", duplicated_song.lyrics
    assert_equal 10, duplicated_song.row_order
    assert_equal "Click track", duplicated_asset.name
    assert_equal 20, duplicated_asset.row_order
    assert duplicated_asset.file.attached?
  end

  test "deduplicates copied playlist names" do
    playlist = Playlist.create!(name: "Practice")
    Playlist.create!(name: "Practice (copy)")

    post duplicate_playlist_path(playlist)

    assert_equal "Practice (copy 2)", Playlist.order(:created_at).last.name
  end
end
