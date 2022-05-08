const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async(server, {
        collaborationsService,
        validator,
        userService,
        playlistsService,
    }) => {
        const collaborationHandler = new CollaborationsHandler(collaborationsService,
            validator,
            userService,
            playlistsService, );
        server.route(routes(collaborationHandler));
    }
}