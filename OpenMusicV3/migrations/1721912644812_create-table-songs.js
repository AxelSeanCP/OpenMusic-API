/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("songs", {
    song_id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
    performer: {
      type: "VARCHAR(20)",
      notnull: true,
    },
    genre: {
      type: "VARCHAR(10)",
      notnull: true,
    },
    duration: {
      type: "INTEGER",
      notnull: true,
    },
    album_id: {
      type: "VARCHAR(50)",
      notnull: true,
      references: '"albums"',
      onDelete: "CASCADE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("songs");
};
