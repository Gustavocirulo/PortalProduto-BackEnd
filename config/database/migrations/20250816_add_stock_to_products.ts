import db from "../database";

export async function up() {
  await db.transaction(async (trx) => {
    try {
      await db.schema.alterTable('products', (table) => {
        table.integer('stock').notNullable().defaultTo(0);
      });
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  });
}

export async function down() {
  await db.transaction(async (trx) => {
    try {
      await db.schema.alterTable('products', (table) => {
        table.dropColumn('stock');
      });
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  });
}
