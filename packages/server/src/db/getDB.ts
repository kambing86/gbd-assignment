import { promisify } from "util";
import { SqlStatement } from "@nearform/sql";
import Sqlite3, { RunResult } from "sqlite3";

function getDB(filename: string) {
  const sqlite3 = Sqlite3.verbose();
  const db = new sqlite3.Database(filename);

  function serialize(): Promise<void>;
  function serialize() {
    return promisify(db.serialize).bind(db);
  }

  function close(): Promise<void>;
  function close() {
    return promisify(db.close).bind(db);
  }

  return {
    serialize,
    close,
    run: (sql: SqlStatement): Promise<RunResult> => {
      return new Promise((resolve, reject) => {
        db.run(sql.sql, sql.values, function (err) {
          if (err) {
            return reject(err);
          }
          resolve(this);
        });
      });
    },
    all: <Result>(sql: SqlStatement): Promise<Result[]> => {
      return new Promise((resolve, reject) => {
        db.all(sql.sql, sql.values, (err, rows: Result[]) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
    },
    get: <Result>(sql: SqlStatement): Promise<Result> => {
      return new Promise((resolve, reject) => {
        db.get(sql.sql, sql.values, (err, data: Result) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    },
  };
}

export type DB = ReturnType<typeof getDB>;

export default getDB;
