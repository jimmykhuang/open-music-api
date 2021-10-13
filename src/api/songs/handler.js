class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const songId = await this._service.addSong(request.payload);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId,
            },
        });

        response.code(201);
        return response;
    }

    // get all songs
    async getSongsHandler() {
        const songs = await this._service.getSongs();
        return {
            status: 'success',

            data: {
                songs,
            },
        };
    }

    // get song by id
    async getSongByIdHandler(request) {
        // try {
        const { id } = request.params;
        const song = await this._service.getSongById(id);
        return {
            status: 'success',
            data: {
                song,
            },
        };
    }

    // put song by id
    async putSongByIdHandler(request) {
        this._validator.validateSongPayload(request.payload);
        const {
            title,
            year,
            performer,
            genre,
            duration,
        } = request.payload;
        const { id } = request.params;

        // await this._service.editSongById(id, request.payload);
        await this._service.editSongById(id, {
            title,
            year,
            performer,
            genre,
            duration,
        });

        return {
            status: 'success',
            message: 'Lagu berhasil diperbarui',
        };
    }

    // delete song
    async deleteSongByIdHandler(request) {
        const { id } = request.params;
        await this._service.deleteSongById(id);
        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
}

module.exports = SongsHandler;