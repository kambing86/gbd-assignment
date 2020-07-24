import http from "http";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import expressJwt from "express-jwt";
import expressPlayground from "graphql-playground-middleware-express";
import { algorithm, secret } from "./auth";
import initDB from "./db";
import { resolvers, typeDefs } from "./graphql";
import logger from "./logger";

const port = 8010;

(async () => {
  const app = express();
  app.use(
    expressJwt({
      secret,
      algorithms: [algorithm],
      credentialsRequired: false,
    }),
  );
  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // @ts-ignore
      const user = req?.user ?? null;
      return { user };
    },
    playground: false,
  });
  app.get(
    apolloServer.graphqlPath,
    expressPlayground({
      endpoint: apolloServer.graphqlPath,
      subscriptionEndpoint: apolloServer.graphqlPath,
    }),
  );
  apolloServer.applyMiddleware({ app });
  apolloServer.installSubscriptionHandlers(httpServer);

  await initDB();

  httpServer.listen(port, () => {
    logger.info(`App started and listening on port ${port}`);
  });
})();
