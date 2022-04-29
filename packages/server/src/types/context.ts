import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

export type GraphQLContext = {
  auth?: {
    id: number;
    username: string;
    isAdmin: boolean;
    iat: number;
    exp: number;
  };
} & ExpressContext;
