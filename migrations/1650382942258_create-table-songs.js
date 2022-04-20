/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(30)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true
        },
        year: {
            type: 'integer',
            notNull: true
        },
        genre: {
            type: 'TEXT',
            notNull: true
        },
        performer: {
            type: 'TEXT',
            notNull: true
        },
        duration: {
            type: 'integer',

        },
        album_id: {
            type: 'VARCHAR(30)',


        },
    })
    pgm.createTable('albums', {
            id: {
                type: 'VARCHAR(30)',
                primaryKey: true,

            },
            name: {
                type: 'VARCHAR',
                notNull: true,
            },
            year: {
                type: 'integer',
                notNull: true,
            }
        })
        //pgm.createIndex('songs', 'albumId')

};


//exports.down = pgm => {};