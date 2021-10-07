//materi diambil dari https://www.dicoding.com/academies/271/tutorials/14382?from=14502
// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

//songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

//users

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

//authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const init = async() => {
    const songsService = new SongsService();
    const usersService = new UsersService();
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
    // registrasi plugin eksternal
    await server.register([{
        plugin: Jwt,
    }, ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('songsapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });
    // server.ext('onPreResponse', (request, h) => {
    //     // mendapatkan konteks response dari request
    //     const { response } = request;

    //     if (response instanceof ClientError) {
    //         // membuat response baru dari response toolkit sesuai kebutuhan error handling
    //         const newResponse = h.response({
    //             status: 'fail',
    //             message: response.message,
    //         });
    //         newResponse.code(response.statusCode);
    //         return newResponse;
    //     }

    //     // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    //     return response.continue || response;
    // });


    await server.register([{
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        }, {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
    ]);

    await server.start();
    console.log(`Server Run On ${server.info.uri}`);
};

init();