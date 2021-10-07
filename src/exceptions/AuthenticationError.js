const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
    constructor(message) {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

module.exports = AuthenticationError;
//referensi dari https://www.dicoding.com/academies/271/tutorials/17664?from=17659