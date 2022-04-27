require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const songs = require('./api/Musics');
const albums = require('./api/Albums')
const SongsService = require('./services/postgres/SongsService');
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')


const users = require('./api/users');
const UserService = require('./services/postgres/UserService')
const UserValidator = require('./validator/users')

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistService')
const PlaylistsValidator = require('./validator/playlists')

const authentications = require('./api/Authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/tokenManager')

const collaborations = require('./api/Collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations')

const init = async() => {
    const collaborationsService = new CollaborationsService();
    const songsService = new SongsService();
    const albumsService = new AlbumsService();
    const userService = new UserService();
    const playlistsService = new PlaylistsService(collaborationsService);
    const authenticationsService = new AuthenticationsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    //registrasi plugin externally

    await server.register([{
        plugin: Jwt,
    }]);

    //mendeefinisikan strategy otentifikasi
    server.auth.strategy('opeenmusicapp_jwt', 'jwt', {
        key: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE
        },
        validate: (artifacts) => ({
            isValid: true,
            creedentials: {
                id: artifacts.decoded.payload.id,
            }
        })
    })
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
        },
        {
            plugin: users,
            options: {
                service: userService,
                validator: UserValidator,
            }
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator,
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                userService,
                validator: AuthenticationsValidator,
                tokenManager: TokenManager,
            }
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                validator: CollaborationsValidator,
                userService,
                playlistsService,

            }
        }

    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();