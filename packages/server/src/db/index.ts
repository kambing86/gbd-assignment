import SQL from "@nearform/sql";
import getDB, { DB } from "./getDB";
import buildSchemas from "./schemas";
import createSeeds from "./seeds";

export { DB };

function dbFunc<Result>(
  fn: (db: DB) => Promise<Result> | Result,
): Promise<Result>;
function dbFunc(): Promise<void>;

async function dbFunc<Result>(fn?: (db: DB) => Promise<Result> | Result) {
  const dbInstance = getDB("./database.db");
  await dbInstance.serialize();
  try {
    await dbInstance.all(SQL`SELECT * FROM Users`);
  } catch {
    // schema not exists
    await buildSchemas(dbInstance);
    await createSeeds(dbInstance);
  }
  const result = fn && (await fn(dbInstance));
  dbInstance.close();
  return result;
}

export default dbFunc;
