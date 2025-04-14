class CreateSongs < ActiveRecord::Migration[8.0]
  def change
    create_table :songs do |t|
      t.references :playlist, null: false, foreign_key: true
      t.string :name
      t.integer :bpm
      t.string :time_signature

      t.timestamps
    end
  end
end
