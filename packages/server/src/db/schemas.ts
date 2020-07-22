import SQL from "@nearform/sql";
import { DB } from "./getDB";

export default async (db: DB): Promise<DB> => {
  const createUsers = SQL`
  CREATE TABLE Users
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    isAdmin BOOLEAN NOT NULL
  )`;
  const createProducts = SQL`
  CREATE TABLE Products
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    isUp BOOLEAN NOT NULL
  )`;
  const createOrders = SQL`
  CREATE TABLE Orders
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES Users(id)
  )`;
  const createOrderDetails = SQL`
  CREATE TABLE OrderDetails
  (
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    UNIQUE (orderId, productId)
    FOREIGN KEY(orderId) REFERENCES Orders(id)
    FOREIGN KEY(productId) REFERENCES Products(id)
  )`;

  await db.run(createUsers);
  await db.run(createProducts);
  await db.run(createOrders);
  await db.run(createOrderDetails);

  return db;
};
