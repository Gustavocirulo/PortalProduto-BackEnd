import db from "../database";
import bcrypt from 'bcrypt';

export async function seed() {
  await db.transaction(async (trx) => {
    try {
      await trx('users').insert({
        name: 'Lucas',
        email: 'gustavocirulo@hotmail.com',
        password: await hashPassword('123456')
      });

      await trx('users').insert({
        name: 'Administrador',
        email: 'admin',
        password: await hashPassword('admin')
      });

      await trx('roles').insert({
        name: 'admin'
      });

      await trx('roles').insert({
        name: 'user'
      });

      await trx('user_roles').insert({
        user_id: 1,
        role_id: 1
      });

      await trx('user_roles').insert({
        user_id: 1,
        role_id: 2
      });

    } catch (error) {
      await trx.rollback();
      throw error;
    }
  });
}

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}