import SQL from "@nearform/sql";
import argon2 from "@phc/argon2";
import jwt from "jsonwebtoken";
import { algorithm, secret } from "~/auth";
import initDb from "~/db";
import { DbUser } from "~/db/schemas";
import { Resolvers } from "~/types/graphql";
import withAuthResolver from "../utils/withAuthResolver";

export default {
  Query: {
    user: withAuthResolver((_parent, _args, context) => {
      return context.user;
    }),
  },
  Mutation: {
    login(_parent, args) {
      return initDb(async (db) => {
        const users = await db.all<DbUser>(
          SQL`SELECT * FROM Users WHERE username = ${args.username}`,
        );
        if (users.length === 0) return null;
        const user = users[0];
        const match = await argon2.verify(user.password, args.password);
        if (match) {
          return jwt.sign(
            {
              id: user.id,
              username: user.username,
              isAdmin: user.isAdmin,
            },
            secret,
            { algorithm, expiresIn: "1d" },
          );
        }
        return null;
      });
    },
  },
} as Resolvers;
