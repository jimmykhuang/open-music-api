const mapDBToModel = ({ created_at, updated_at, ...args }) => ({
    ...args,
    insertedAt: created_at,
    updatedAt: updated_at,
});

const mapDBToPlaylist = ({
    id,
    name,
    username,
}) => ({
    id,
    name,
    username,
});
module.exports = { mapDBToModel }