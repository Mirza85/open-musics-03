const routes = (handler) => [{
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportMusicsHandler,
    options: {
        auth: 'openmusicsapp_jwt',
    },
}, ];

module.exports = routes;