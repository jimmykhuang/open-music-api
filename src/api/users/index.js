const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'users',
    version: '1.0.0',
    register: async(server, { service, validator }) => {
        const usersHandler = new UsersHandler(service, validator);
        server.route(routes(usersHandler));
    },
};
//referensi dari https://www.dicoding.com/academies/271/tutorials/17594?from=17590