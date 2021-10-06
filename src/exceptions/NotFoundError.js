const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
    constructor(message) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

module.exports = NotFoundError;
//referensi dari https://www.dicoding.com/academies/271/tutorials/14477