import SQL from "@nearform/sql";
import argon2 from "@phc/argon2";
import jwt from "jsonwebtoken";
import { secret, algorithm } from "~/auth";
import initDb from "~/db";
import { User } from "~/db/seeds";
import { Resolvers } from "~/types/graphql";

export default {
  Query: {
    user: async (_parent, _args, context) => {
      if (context.user === null) {
        throw new Error("Auth Error");
      }
      return context.user;
    },
  },
  Mutation: {
    async login(_parent, args) {
      const db = await initDb();
      const users = await db.all<User>(
        SQL`SELECT * FROM Users WHERE username = ${args.username}`,
      );
      if (users.length === 0) return null;
      const match = await argon2.verify(users[0].password, args.password);
      if (match) {
        return jwt.sign(users[0], secret, { algorithm, expiresIn: "1d" });
      }
      return null;
    },
  },
} as Resolvers;
