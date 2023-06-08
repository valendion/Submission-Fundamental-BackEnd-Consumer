const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(userId) {
    const playlist = await this._pool.query({
      text: `SELECT playlists.id, playlists.name FROM playlists 
              LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
              WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [userId],
    });

    const songs = await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
              LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id
              LEFT JOIN playlists playlists ON playlists.id = playlist_songs.playlist_id
              WHERE playlists.id = $1`,
      values: [userId],
    });

    // playlist.rows[0].songs = songs.rows;

    return {
      ...playlist.rows[0],
      songs: songs.rows,
    };
  }
}

module.exports = PlaylistsService;
