exports.up = function (knex) {
  return knex.schema
    .createTable('roles', (table) => {
      table.increments();
      table
        .string('department', 128)
        .notNullable()
        .unique();
    })
    .createTable('users', (table) => {
      table.increments();
      table
        .string('username', 128)
        .notNullable()
        .unique()
        .index();
      table.string('password', 256).notNullable();
      table.string('department', 128);
      table
        .integer('role')
        .unsigned()
        .references('roles.id')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
        .defaultTo(2);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('roles');
};
