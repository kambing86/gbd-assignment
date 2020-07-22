import SQL from "@nearform/sql";
import argon2 from "@phc/argon2";
import initDb from "~/db";
import { User } from "~/db/seeds";

export default {
  Query: {
    user: async (
      _parent: unknown,
      args: { username: string; password: string },
    ) => {
      const db = await initDb();
      const users = await db.all<User>(
        SQL`SELECT * FROM Users WHERE username = ${args.username}`,
      );
      if (users.length === 0) return null;
      const match = await argon2.verify(users[0].password, args.password);
      if (match) {
        return users[0];
      }
      return null;
    },
  },
};
