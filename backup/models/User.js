// backend/models/User.js

import db from '../config/db.js';

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE user_email = ?', [email]);
    return rows[0];
  },
  create: async (user) => {
    const { user_email, user_password, firstname, lastname, phone, user_role } = user;
    const [result] = await db.execute(
      'INSERT INTO users (user_email, user_password, firstname, lastname, phone, user_role) VALUES (?, ?, ?, ?, ?, ?)',
      [user_email, user_password, firstname, lastname, phone, user_role]
    );
    return result;
  }
};

export default User;
