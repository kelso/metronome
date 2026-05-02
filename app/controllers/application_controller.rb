class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :set_navigation_playlists

  private

  def set_navigation_playlists
    @navigation_playlists = Playlist.includes(:songs).order(:created_at).to_a
  end
end
