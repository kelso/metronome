require "test_helper"

class SongsControllerTest < ActionDispatch::IntegrationTest
  test "show includes duplicate playlist action" do
    playlist = Playlist.create!(name: "Practice")
    song = playlist.songs.create!(name: "Intro", bpm: 120, time_signature: "4/4")

    get playlist_song_path(playlist, song)

    assert_response :success
    assert_select "form[action=?][method=?]", duplicate_playlist_path(playlist), "post"
    assert_select "button", text: /Duplicate Playlist/
  end
end
