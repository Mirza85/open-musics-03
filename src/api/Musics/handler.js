const ClientError = require('../../exceptions/ClientError')
class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);

    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { title, year, performer, genre, duration, albumId } = request.payload;

            const musicId = await this._service.addSong({ title, year, performer, genre, duration, albumId });
            const response = h.response({
                status: 'success',
                message: 'Song berhasil ditambahkan',
                data: {
                    musicId,
                },
            });
            response.code(201);
            return response;


        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //server error

            const response = h.response({
                status: 'error',
                message: 'Maaf terjadi kesalahan server'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getAllSongsHandler() {
        const songs = await this._service.getAllSongs();
        return {
            status: 'success',
            data: {
                songs,
            }
        }

    }


    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);
            return {
                status: 'success',
                data: {
                    song,
                }
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,

                });
                response.code(error.statusCode);
                return response;

            }

            // server ERROR response

            const response = h.response({
                status: 'error',
                message: 'maaf, terjadi kesalahan pada server kami',
            });
            response.code(500);
            console.error(error);
            return response;

        }
    }
}


module.exports = SongsHandler;