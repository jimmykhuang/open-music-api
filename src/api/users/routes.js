const routes = (handler) => [{
        method: 'POST',
        path: '/users',
        handler: handler.postUserHandler,
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: handler.getUserByIdHandler,
    },
];

module.exports = routes;
//referensi dari https: //www.dicoding.com/academies/271/tutorials/17588?from=17586