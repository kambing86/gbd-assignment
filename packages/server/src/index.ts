import http from "http";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request } from "express";
import expressJwt from "express-jwt";
import expressPlayground from "graphql-playground-middleware-express";
import { algorithm, secret } from "./auth";
import initDB from "./db";
import { resolvers, typeDefs } from "./graphql";
import logger from "./logger";

const port = 8010;

void (async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );
  app.use(
    expressJwt({
      secret,
      algorithms: [algorithm],
      credentialsRequired: false,
      getToken: (req: Request) => {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          return req.headers.authorization.split(" ")[1];
        }
        return req.cookies.token;
      },
    }),
  );
  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: (expressContext) => {
      const { req } = expressContext;
      // req.user generated from express-jwt
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const user = req?.user ?? null;
      return { ...expressContext, user };
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
  apolloServer.applyMiddleware({ app, cors: false });
  apolloServer.installSubscriptionHandlers(httpServer);

  await initDB();

  httpServer.listen(port, () => {
    logger.info(`App started and listening on port ${port}`);
  });
})();
