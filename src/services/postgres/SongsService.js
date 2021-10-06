//referensi dari https://www.dicoding.com/academies/271/tutorials/17476?from=17469
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapGetSongs, mapGetSongById } = require('../../utils');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({
            title,
            year,
            performer,
            genre,
            duration,
        }) {
            const id = `song-${nanoid(16)}`;
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;

            const query = {
                text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
                values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
            };

            const result = await this._pool.query(query);

            if (!result.rows[0].id) {
                throw new InvariantError('Song failed to add');
            }

            return result.rows[0].id;
        }
        //referensi dari https://www.dicoding.com/academies/271/tutorials/17516?from=17476
    async getSongs() {
        const result = await this._pool.query('SELECT id, title, performer FROM songs');
        return result.rows.map(mapGetSongs);
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Song not found');
        }

        return result.rows.map(mapGetSongById)[0];
    }

    async editSongById(id, {
            title,
            year,
            performer,
            genre,
            duration,
        }) {
            const updatedAt = new Date().toISOString();

            const query = {
                text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
                values: [title, year, performer, genre, duration, updatedAt, id],
            };

            const result = await this._pool.query(query);

            if (!result.rows.length) {
                throw new NotFoundError('Failed to update song. Id not found');
            }
        }
        //referensi dari https://www.dicoding.com/academies/271/tutorials/17528?from=17516
    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Failed to delete song. Id not found');
        }
    }
}

module.exports = SongsService;