const routes = (handler) => [{
        method: 'POST',
        path: '/songs',
        handler: handler.postSongHandler,

    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongsHandler,

    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongByIdHandler,

    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.putSongByIdHandler,

    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSongByIdHandler,

    },
];

module.exports = routes;

//referensi dari https://www.dicoding.com/academies/271/tutorials/17711?from=17709