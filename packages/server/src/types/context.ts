import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

export type GraphQLContext = {
  user?: {
    id: number;
    username: string;
    isAdmin: boolean;
  };
} & ExpressContext;
