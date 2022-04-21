require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/Musics');
const albums = require('./api/Albums')
const SongsService = require('./services/postgres/SongsService');
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')
const init = async() => {
    const songsService = new SongsService();
    const albumsService = new AlbumsService();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([{
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator,
        },
    }, {
        plugin: albums,
        options: {
            service: albumsService,
            validator: AlbumsValidator,

        }
    }]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();