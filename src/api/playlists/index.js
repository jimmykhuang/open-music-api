const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async(server, { service, validator }) => {
        const playlistsapiHandler = new PlaylistsHandler(service, validator);
        server.route(routes(playlistsapiHandler));
    },
};