const mapDBToModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId
});

const mapDBToAlbumsModel = ({
    id,
    name,
    year,
    coverUrl,
}) => ({
    id,
    name,
    year,
    coverUrl,
})

module.exports = { mapDBToModel, mapDBToAlbumsModel };