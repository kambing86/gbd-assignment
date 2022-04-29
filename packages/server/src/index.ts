import http from "http";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request } from "express";
import { ExpressJwtRequestUnrequired, expressjwt } from "express-jwt";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { algorithm, secret } from "./auth";
import { initDB } from "./db";
import { schema } from "./graphql";
import logger from "./logger";

const port = 8010;

void (async () => {
  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    }),
  );
  app.use(
    expressjwt({
      secret,
      algorithms: [algorithm],
      credentialsRequired: false,
      getToken: (req: Request) => {
        const { authorization } = req.headers;
        if (authorization?.split(" ")[0] === "Bearer") {
          return authorization.split(" ")[1];
        }
        return (req.cookies as Record<string, string | undefined>).token;
      },
    }),
  );
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
  });
  const serverCleanup = useServer({ schema }, wsServer);
  const apolloServer = new ApolloServer({
    schema,
    context: (expressContext) => {
      const req = expressContext.req as ExpressJwtRequestUnrequired;
      // req.auth generated from express-jwt
      const auth = req?.auth ?? null;
      return { ...expressContext, auth };
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        // eslint-disable-next-line @typescript-eslint/require-await
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  await initDB();

  httpServer.listen(port, () => {
    logger.info(`App started and listening on port ${port}`);
  });
})();
