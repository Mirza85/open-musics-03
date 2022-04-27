/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        username: {
            type: 'varchar(255)',
            notNull: true,
            unique: true,

        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
        fullname: {
            type: 'TEXT',
            notNull: true,
        },
    })
};

exports.down = pgm => {
    pgm.dropTable('users');
};