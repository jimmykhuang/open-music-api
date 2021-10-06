//referensi dari https://www.dicoding.com/academies/271/tutorials/17516?from=17476
const mapGetSongs = ({
    id,
    title,
    performer,
}) => ({
    id,
    title,
    performer,
});

const mapGetSongById = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    inserted_at,
    updated_at,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: inserted_at,
    updatedAt: updated_at,
});

module.exports = { mapGetSongs, mapGetSongById };