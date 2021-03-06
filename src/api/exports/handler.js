const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
    constructor(service, validator, playlistsService) {
        this._service = service;
        this._validator = validator;
        this._playlistsService = playlistsService;

        this.postExportMusicsHandler = this.postExportMusicsHandler.bind(this);
    }

    async postExportMusicsHandler(request, h) {
        try {
            this._validator.validateExportsPlaylistPayload(request.payload);

            const { id: userId } = request.auth.credentials;
            const { playlistId } = request.params;
            const { targetEmail } = request.payload;
            console.log(playlistId)
            await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
            const message = {
                userId,
                playlistId,
                targetEmail,
            };

            await this._service.sendMessage('export:musics', JSON.stringify(message));

            const response = h.response({
                status: 'success',
                message: 'Permintaan Anda dalam antrean',
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
            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = ExportsHandler;