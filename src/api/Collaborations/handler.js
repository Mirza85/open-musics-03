const ClientError = require('../../exceptions/ClientError');

class Collaborationshandler {
    constructor(collaborationsService, validator, userService, playlistsService) {
        this._collaborationsService = collaborationsService;
        this._validator = validator;
        this._usersService = userService;
        this._playlistsService = playlistsService;



        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.getPlaylistsById(playlistId);
            //console.log(result)
            await this._usersService.getUserById(userId);

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

            const collaborationId = await this._service.addCollaboration(playlistId, userId)
            const response = h.response({
                status: 'success',
                data: {
                    collaborationId,
                }
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

            // server error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.log(error);
            return response;
        }
    }

    async deleteCollaborationHandler(request, h) {
        try {

            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._service.deleteCollaboration(playlistId, userId);
            return {
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            };
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
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.log(error);
            return response;
        }
    }
}

module.exports = Collaborationshandler;