const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async(server, {
        authenticationsService,
        usersService,
        tokenManager,
        validator,
    }) => {
        const authenticationsHandler = new AuthenticationsHandler(
            authenticationsService,
            usersService,
            tokenManager,
            validator,
        );
        server.route(routes(authenticationsHandler));
    },
};
//referensi dari https://www.dicoding.com/academies/271/tutorials/17700?from=17696