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
}) => ({
    id,
    name,
    year
})

module.exports = { mapDBToModel, mapDBToAlbumsModel };