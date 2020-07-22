import { ApolloServer } from "apollo-server-express";
import express from "express";
import initDB from "./db";
import { typeDefs, resolvers } from "./graphql";
import logger from "./logger";

const port = 8010;

(async () => {
  const app = express();
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  apolloServer.applyMiddleware({ app });
  await initDB();

  app.listen(port, () => {
    logger.info(`App started and listening on port ${port}`);
  });
})();
