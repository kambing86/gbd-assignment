import SQL, { glue } from "@nearform/sql";
import { withFilter } from "apollo-server-express";
import initDb from "~/db";
import { DbProduct } from "~/db/schemas";
import { Product, Resolvers } from "~/types/graphql";
import pubsub, { PUBSUB_PRODUCT, publishProduct } from "../pubsub";
import withAuthResolver from "../utils/withAuthResolver";

export default {
  Query: {
    products: (_parent, args) => {
      const { skip, limit } = args;
      return initDb((db) => {
        return db.all<DbProduct>(SQL`
        SELECT * FROM Products
        LIMIT ${limit} OFFSET ${skip}
        `);
      });
    },
    productsOnShelf: (_parent, args) => {
      const { skip, limit } = args;
      return initDb((db) => {
        return db.all<DbProduct>(SQL`
        SELECT * FROM Products
        WHERE isUp = true
        LIMIT ${limit} OFFSET ${skip}
        `);
      });
    },
  },
  Mutation: {
    updateProduct: withAuthResolver((_parent, args, context) => {
      if (!context.user?.isAdmin) {
        throw new Error("not allow to update");
      }
      const { id, data } = args;
      const dataEntries = Object.entries(data);
      if (dataEntries.length === 0) return false;
      const modifiers = glue(
        dataEntries.map(([key, value]) =>
          SQL``.append(SQL`${key}`, { unsafe: true }).append(SQL` = ${value}`),
        ),
        ",",
      );
      return initDb(async (db) => {
        const sqlStatement = SQL`
        UPDATE Products
        SET `.append(modifiers).append(SQL`
        WHERE id = ${id}
        `);
        const result = await db.run(sqlStatement);
        const success = Boolean(result.changes);
        if (success) {
          const product = await db.get<DbProduct>(SQL`
          SELECT * From Products WHERE id = ${id}`);
          publishProduct(product);
        }
        return success;
      });
    }),
  },
  Subscription: {
    products: {
      subscribe: () => pubsub.asyncIterator<Product>([PUBSUB_PRODUCT]),
    },
    product: {
      subscribe: withFilter(
        () => pubsub.asyncIterator<Product>([PUBSUB_PRODUCT]),
        (payload, args) => {
          const id: number = args.id;
          return payload.product.id === id;
        },
      ),
    },
  },
} as Resolvers;
