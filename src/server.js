require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const inert = require('@hapi/inert');


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

const playlistSongs = require('./api/PlaylistSongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistSongs')

const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');


const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads')

const albumsLike = require('./api/albumsLike');
const AlbumsLikeService = require('./services/postgres/AlbumsLikeService');
const CacheService = require('./services/redis/CacheService')

const init = async() => {
    const collaborationsService = new CollaborationsService();
    const songsService = new SongsService();
    const albumsService = new AlbumsService();
    const userService = new UserService();
    const playlistsService = new PlaylistsService(collaborationsService);
    const authenticationsService = new AuthenticationsService();
    const playlistSongsService = new PlaylistSongsService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/covers'))
    const cacheService = new CacheService();
    const albumsLikeService = new AlbumsLikeService(cacheService);

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
        },
        {
            plugin: inert,
        }
    ]);

    //mendeefinisikan strategy otentifikasi
    server.auth.strategy('openmusicsapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
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
        },
        {
            plugin: playlistSongs,
            options: {
                playlistSongsService,
                songsService,
                playlistsService,
                validator: PlaylistSongsValidator,
            }
        },
        {
            plugin: _exports,
            options: {
                service: ProducerService,

                validator: ExportsValidator,
                playlistsService,
            }
        },
        {
            plugin: uploads,
            options: {
                service: storageService,
                validator: UploadsValidator,
                albumsService,
            }
        },
        {
            plugin: albumsLike,
            options: {
                service: albumsLikeService,
                albumsService,
            }

        }

    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();