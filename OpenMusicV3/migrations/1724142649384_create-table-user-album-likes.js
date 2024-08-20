/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("user_album_likes", {
    user_album_likes_id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(user_id)",
      onDelete: "CASCADE",
    },
    album_id: {
      type: "VARCHAR(50)",
      notnull: true,
      references: '"albums"',
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("user_album_likes", "unique_user_id_album_id", {
    unique: ["user_id", "album_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint("user_album_likes", "unique_user_id_album_id");
  pgm.dropTable("user_album_likes");
};
