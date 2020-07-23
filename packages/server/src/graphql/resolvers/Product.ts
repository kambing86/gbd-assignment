import SQL, { glue } from "@nearform/sql";
import { withFilter } from "apollo-server-express";
import initDb from "~/db";
import { Resolvers, Product } from "~/types/graphql";
import pubsub from "../pubsub";
import withAuthResolver from "../utils/withAuthResolver";

export const PUBSUB_PRODUCT = "PUBSUB_PRODUCT";

export default {
  Query: {
    products: async (_parent, args) => {
      const { skip, limit } = args;
      const db = await initDb();
      const products = await db.all(SQL`
      SELECT * FROM Products
      LIMIT ${limit} OFFSET ${skip}
      `);
      return products;
    },
    productsOnShelf: async (_parent, args) => {
      const { skip, limit } = args;
      const db = await initDb();
      const products = await db.all(SQL`
      SELECT * FROM Products
      WHERE isUp = true
      LIMIT ${limit} OFFSET ${skip}
      `);
      return products;
    },
  },
  Mutation: {
    updateProduct: withAuthResolver(async (_parent, args, context) => {
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
      const db = await initDb();
      const sqlStatement = SQL`
      UPDATE Products
      SET `.append(modifiers).append(SQL`
      WHERE id = ${id}
      `);
      const result = await db.run(sqlStatement);
      const success = Boolean(result.changes);
      if (success) {
        const product = await db.get<Product>(SQL`
        SELECT * From Products WHERE id = ${id}`);
        pubsub.publish(PUBSUB_PRODUCT, { products: product, product });
      }
      return success;
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
