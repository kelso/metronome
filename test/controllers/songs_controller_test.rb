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

  test "show includes sortable song list data" do
    playlist = Playlist.create!(name: "Practice")
    song = playlist.songs.create!(name: "Intro", bpm: 120, time_signature: "4/4")

    get playlist_song_path(playlist, song)

    assert_response :success
    assert_select "div[data-controller~=?]", "playlist-sort"
    assert_select "a[draggable=?][data-playlist-sort-reorder-url=?]", "true", reorder_playlist_song_path(playlist, song)
  end

  test "reorders song within playlist" do
    playlist = Playlist.create!(name: "Practice")
    first = playlist.songs.create!(name: "Intro", bpm: 120, time_signature: "4/4", row_order: 10)
    second = playlist.songs.create!(name: "Verse", bpm: 122, time_signature: "4/4", row_order: 20)
    third = playlist.songs.create!(name: "Outro", bpm: 124, time_signature: "4/4", row_order: 30)

    patch reorder_playlist_song_path(playlist, third), params: { row_order_position: 0 }, as: :json

    assert_response :no_content
    assert_equal [third.id, first.id, second.id], playlist.songs.rank(:row_order).pluck(:id)
  end

  test "rejects invalid reorder position" do
    playlist = Playlist.create!(name: "Practice")
    song = playlist.songs.create!(name: "Intro", bpm: 120, time_signature: "4/4")

    patch reorder_playlist_song_path(playlist, song), params: { row_order_position: "nope" }, as: :json

    assert_response :unprocessable_entity
  end
end
