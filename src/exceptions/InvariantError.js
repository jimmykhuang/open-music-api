const ClientError = require('./ClientError');

class InvariantError extends ClientError {
    constructor(message) {
        super(message);
        this.name = 'InvariantError';
    }
}

module.exports = InvariantError;
//referensi dari https://www.dicoding.com/academies/271/tutorials/14477