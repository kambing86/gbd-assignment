import { Sequelize } from "sequelize";
import Sqlite3 from "sqlite3";

let sequelize: Sequelize | null = null;

export default function getDB() {
  if (sequelize != null) return sequelize;
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.db",
    dialectOptions: {
      readWriteMode: Sqlite3.OPEN_CREATE,
    },
    logging: false,
  });
  return sequelize;
}
