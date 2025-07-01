class SongsController < ApplicationController
  before_action :set_playlist
  before_action :set_song, only: %i[show edit update destroy move_up move_down]

  def show; end

  def new
    @song = @playlist.songs.build
  end

  def create
    @song = @playlist.songs.build(song_params)
    if @song.save
      redirect_to playlist_path(@playlist), notice: "Song created!"
    else
      render :new
    end
  end

  def edit; end

  def update
    if @song.update(song_params)
      redirect_to playlist_path(@playlist), notice: "Song updated!"
    else
      render :edit
    end
  end

  def destroy
    @song.destroy
    redirect_to playlist_path(@playlist), notice: "Song deleted."
  end

  def move_up
    @song.update row_order_position: :up
    redirect_to playlist_path(@playlist)
  end

  def move_down
    @song.update row_order_position: :down
    redirect_to playlist_path(@playlist)
  end

  private

  def set_playlist
    @playlist = Playlist.find(params[:playlist_id])
  end

  def set_song
    @song = @playlist.songs.find(params[:id])
  end

  def song_params
    params.require(:song).permit(:name, :bpm, :time_signature, :lyrics)
  end
end
