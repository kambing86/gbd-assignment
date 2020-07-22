import getDB, { DB } from "./getDB";
import buildSchemas from "./schemas";
import createSeeds from "./seeds";

export { DB };

let dbInstance: DB | null = null;

export default async (): Promise<DB> => {
  if (dbInstance != null) return dbInstance;
  dbInstance = getDB(":memory:");
  await dbInstance.serialize();
  await buildSchemas(dbInstance);
  await createSeeds(dbInstance);
  return dbInstance;
};
