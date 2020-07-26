import SQL from "@nearform/sql";
import argon2 from "@phc/argon2";
import { DB } from "./getDB";

interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

interface Product {
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
    name: "Macbook Pro 13 inch",
    price: 1899,
    quantity: 10,
    isUp: true,
  },
  {
    name: "Macbook Pro 16 inch",
    price: 3499,
    quantity: 5,
    isUp: true,
  },
  {
    name: "iPhone 11 Pro",
    price: 1649,
    quantity: 10,
    isUp: true,
  },
  {
    name: "iPhone 11 Pro Max",
    price: 1799,
    quantity: 5,
    isUp: true,
  },
  {
    name: "iPhone 11",
    price: 1149,
    quantity: 10,
    isUp: true,
  },
  {
    name: "iPhone SE",
    price: 649,
    quantity: 10,
    isUp: true,
  },
  {
    name: "iPad Pro 11 inch",
    price: 1199,
    quantity: 10,
    isUp: true,
  },
  {
    name: "iPad Pro 12.9 inch",
    price: 1499,
    quantity: 10,
    isUp: true,
  },
  {
    name: "iPad Air",
    price: 749,
    quantity: 10,
    isUp: true,
  },
  {
    name: "HP Spectre x360",
    price: 2399,
    quantity: 10,
    isUp: true,
  },
  {
    name: "Surface Pro 7",
    price: 1388,
    quantity: 10,
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
