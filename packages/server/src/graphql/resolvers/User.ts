import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { algorithm, secret } from "~/auth";
import UserModel from "~/db/models/UserModel";
import { Resolvers } from "~/types/graphql";
import withAuthResolver from "../utils/withAuthResolver";

export default {
  Query: {
    user: withAuthResolver((_parent, _args, context) => {
      return context.user;
    }),
  },
  Mutation: {
    async login(_parent, args, context) {
      const user = await UserModel.findOne({
        where: { username: args.username },
      });
      if (user == null) return null;
      const match = await argon2.verify(user.password, args.password);
      if (match) {
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
          },
          secret,
          { algorithm, expiresIn: "1d" },
        );
        context.res.cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 1,
        });
        return user;
      }
      return null;
    },
    logout(_parent, _args, context) {
      context.res.cookie("token", "", {
        httpOnly: true,
      });
      return true;
    },
  },
} as Resolvers;
