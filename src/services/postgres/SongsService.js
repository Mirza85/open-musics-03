const { Pool } = require('pg');
const { nanoid } = require('nanoId');
const { mapDBToModel } = require('../../utils')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, performer, genre, duration, albumId }) {
        const id = nanoid(16)
            //const albumID = nanoid(16)

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, performer, genre, duration, albumId]
        }

        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError('musik gagal ditambahkan');
        }

        return result.rows[0].id;



    }

    async getAllSongs() {
        const result = await this._pool.query('SELECT id,title,performer from songs');

        return result.rows.map(mapDBToModel)
    }

    async getSongById(id) {
        const query = {
            text: 'select * from songs where id = $1',
            values: [id],
        }
        const result = await this._pool.query(query);
        if (!result.rows[0]) {
            throw new NotFoundError('Lagu tidak ditemukan')
        }
        return result.rows[0].id;
    }
}

module.exports = SongsService;