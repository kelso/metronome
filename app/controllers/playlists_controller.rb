class PlaylistsController < ApplicationController
  before_action :set_playlist, only: %i[show edit update destroy]

  def index
    @playlists = Playlist.all
  end

  def show
    @songs = @playlist.songs.rank(:row_order)
  end

  def new
    @playlist = Playlist.new
  end

  def create
    @playlist = Playlist.new(playlist_params)
    if @playlist.save
      redirect_to @playlist, notice: "Playlist created!"
    else
      render :new
    end
  end

  def edit; end

  def update
    if @playlist.update(playlist_params)
      redirect_to @playlist, notice: "Playlist updated!"
    else
      render :edit
    end
  end

  def destroy
    @playlist.destroy
    redirect_to playlists_path, notice: "Playlist deleted."
  end

  private

  def set_playlist
    @playlist = Playlist.find(params[:id])
  end

  def playlist_params
    params.require(:playlist).permit(:name)
  end
end
