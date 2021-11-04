const ExportSongsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
    validateExportSongsPayload: (payload) => {
        const validationResult = ExportSongsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ExportsValidator;

//referensi dari https://www.dicoding.com/academies/271/tutorials/17633?from=17629