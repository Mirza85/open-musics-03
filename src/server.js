require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/Musics');
const SongsService = require('./services/postgres/SongsService');
const AlbumsBService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')
const init = async() => {
    const songsService = new SongsService();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register({
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator,
        },
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();