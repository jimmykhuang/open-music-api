const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel, mapDBToPlaylist } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const addResult = await this._pool.query(query);

        if (!addResult.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return addResult.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
            LEFT JOIN users ON users.id = playlists.owner
            LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id  
            WHERE playlists.owner = $1 OR collaborations.user_id = $1;`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getPlaylistById(id) {
        const query = {
            text: `SELECT playlists.*, users.username FROM playlists
          LEFT JOIN users ON users.id = playlists.owner
          WHERE playlists.id = $1`,
            values: [id],
        };

        const getIdResult = await this._pool.query(query);

        if (!getIdResult.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return getIdResult.rows.map(mapDBToPlaylist)[0];
    }

    async editPlaylistById(id, { name }) {
        const query = {
            text: 'UPDATE playlists SET name = $1, WHERE id = $2 RETURNING id',
            values: [name, id],
        };

        const editIdResult = await this._pool.query(query);

        if (!editIdResult.rowCount) {
            throw new NotFoundError('Gagal memperbarui playlist.Id tidak ditemukan');
        }
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const deleteResult = await this._pool.query(query);

        if (!deleteResult.rowCount) {
            throw new NotFoundError('Playlist gagal dihapus.Id tidak ditemukan');
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [id],
        };

        const verifyResult = await this._pool.query(query);

        if (!verifyResult.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
        const playlist = verifyResult.rows[0];
        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(id, userId) {
        try {
            await this.verifyPlaylistOwner(id, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyFromCollaborator(id, userId);
            } catch {
                throw error;
            }
        }
    }

    // Playlist

    async addPlaylistSong(playlistId, songId) {
        const id = `playlistsong-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1,$2,$3) RETURNING id',
            values: [id, playlistId, songId],
        };
        const addplaylistResult = await this._pool.query(query);
        if (!addplaylistResult.rowCount) {
            throw new InvariantError('lagu gagal ditambahkan ke playlist');
        }
        return addplaylistResult.rows[0].id;
    }

    async getPlaylistSongs(playlistId) {
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer FROM songs
        LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id
        WHERE playlistsongs.playlist_id = $1 GROUP BY songs.id`,
            values: [playlistId],
        };
        const getplaylistResult = await this._pool.query(query);
        return getplaylistResult.rows.map(mapDBToModel);
    }

    async deletePlaylistSongById(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const deleteplaylistResult = await this._pool.query(query);
        if (!deleteplaylistResult.rowCount) {
            throw new InvariantError('Lagu gagal dihapus dari playlist.Id lagu tidak ditemukan');
        }
    }
}

module.exports = PlaylistsService;