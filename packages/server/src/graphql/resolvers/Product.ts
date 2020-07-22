import SQL from "@nearform/sql";
import initDb from "~/db";

export default {
  Query: {
    products: async () => {
      const db = await initDb();
      const products = await db.all(SQL`
      SELECT name, quantity, price, isUp FROM Products
      `);
      return products;
    },
  },
};
