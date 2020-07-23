import SQL, { glue } from "@nearform/sql";
import initDb, { DB } from "~/db";
import { DbOrder, DbOrderDetail, DbProduct } from "~/db/schemas";
import { Resolvers } from "~/types/graphql";
import withAuthResolver from "../utils/withAuthResolver";

async function getOrderDetails(db: DB, order: DbOrder) {
  const details = await db.all<DbOrderDetail>(SQL`
  SELECT * FROM OrderDetails
  WHERE orderId = ${order.id}
  `);
  return Promise.all(
    details.map(async (d) => ({
      product: await db.get<DbProduct>(SQL`
      SELECT * FROM Products
      WHERE id = ${d.productId}
      `),
      quantity: d.quantity,
      price: d.price,
    })),
  );
}

export default {
  Query: {
    orders: withAuthResolver(async (_parent, args, context) => {
      const { skip, limit } = args;
      const db = await initDb();
      const { user } = context;
      const id = user?.id ?? 0;
      const orders = await db.all<DbOrder>(SQL`
      SELECT * FROM Orders
      WHERE userId = ${id}
      LIMIT ${limit} OFFSET ${skip}
      `);
      const result = await Promise.all(
        orders.map(async (o) => ({
          ...o,
          details: await getOrderDetails(db, o),
        })),
      );
      return result;
    }),
  },
  Mutation: {
    createOrder: withAuthResolver(async (_parent, args, context) => {
      // TODO: 2 phase commit or transaction
      const {
        data: { details },
      } = args;
      const userId = context.user?.id ?? 0;
      const db = await initDb();
      const allProductIds = glue(
        details.map((d) => SQL`${d.productId}`),
        ",",
      );
      const products = await db.all<DbProduct>(
        SQL`
      SELECT * FROM Products
      WHERE id in (`
          .append(allProductIds)
          .append(SQL`)`),
      );
      let valid = true;
      for (const product of products) {
        const detail = details.find((d) => d.productId === product.id);
        if (product.quantity < (detail?.quantity ?? 0)) {
          valid = false;
        }
      }
      if (!valid) return false;
      for (const product of products) {
        const detail = details.find((d) => d.productId === product.id);
        await db.run(SQL`
        UPDATE Products
        SET quantity = ${product.quantity - (detail?.quantity ?? 0)}
        WHERE id = ${product.id}`);
      }
      const result = await db.run(SQL`
      INSERT INTO Orders (userId, createdDate)
      VALUES (${userId}, datetime('now'))
      `);
      const orderId = result.lastID;
      for (const product of products) {
        const detail = details.find((d) => d.productId === product.id);
        await db.run(SQL`
        INSERT INTO OrderDetails (orderId, productId, quantity, price)
        VALUES (${orderId}, ${product.id}, ${detail?.quantity ?? 0}, ${
          product.price
        })
        `);
      }
      return true;
    }),
  },
} as Resolvers;
