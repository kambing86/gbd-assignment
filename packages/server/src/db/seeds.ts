import SQL from "@nearform/sql";
import argon2 from "@phc/argon2";
import { DB } from "./getDB";

export interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface Product {
  name: string;
  quantity: number;
  price: number;
  isUp: boolean;
}

const initUsers = async () => {
  return [
    {
      username: "test1",
      password: await argon2.hash("P@ssw0rd"),
      isAdmin: false,
    },
    {
      username: "admin",
      password: await argon2.hash("admin"),
      isAdmin: true,
    },
  ] as User[];
};

const products: Product[] = [
  {
    name: "Macbook Pro 16 inch",
    price: 2999,
    quantity: 10,
    isUp: true,
  },
  {
    name: "HP Spectre x360",
    price: 2999,
    quantity: 5,
    isUp: true,
  },
];

export default async (db: DB) => {
  const users = await initUsers();
  for (const user of users) {
    const { username, password, isAdmin } = user;
    await db.run(SQL`
    INSERT INTO Users (username, password, isAdmin)
    VALUES (${username}, ${password}, ${isAdmin})`);
  }
  for (const product of products) {
    const { name, quantity, price, isUp } = product;
    await db.run(SQL`
    INSERT INTO Products (name, quantity, price, isUp)
    VALUES (${name}, ${quantity}, ${price}, ${isUp})`);
  }
};
