const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'songs',
    version: '1.0.0',
    register: async(server, { service, validator }) => {
        const songsHandler = new SongsHandler(service, validator);
        server.route(routes(songsHandler));
    },
};
//referensi dari https://www.dicoding.com/academies/271/tutorials/14432?from=14427