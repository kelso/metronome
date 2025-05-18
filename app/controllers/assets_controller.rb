class AssetsController < ApplicationController
  before_action :set_playlist
  before_action :set_song
  before_action :set_asset, only: [ :edit, :update, :destroy, :move_up, :move_down ]

  def index
    @assets = @song.assets.rank(:row_order)
  end

  def new
    @asset = @song.assets.new
  end

  def create
    @asset = @song.assets.new(asset_params)
    if @asset.save
      redirect_to playlist_song_assets_path(@playlist, @song), notice: "Asset added!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @asset.update(asset_params)
      redirect_to playlist_song_assets_path(@playlist, @song), notice: "Asset updated!"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @asset.destroy
    redirect_to playlist_song_assets_path(@playlist, @song), notice: "Asset removed."
  end

  def move_up
    @asset.update row_order_position: :up
    redirect_to playlist_song_assets_path(@playlist, @song)
  end

  def move_down
    @asset.update row_order_position: :down
    redirect_to playlist_song_assets_path(@playlist, @song)
  end

  private

  def set_playlist
    @playlist = Playlist.find(params[:playlist_id])
  end

  def set_song
    @song = @playlist.songs.find(params[:song_id])
  end

  def set_asset
    @asset = @song.assets.find(params[:id])
  end

  def asset_params
    params.require(:asset).permit(:name, :file)
  end
end
