import { ApolloClient, HttpLink, from, split } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { RetryLink } from "@apollo/client/link/retry";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const cache = new InMemoryCache();
const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://localhost:8010/graphql`,
  }),
);
const httpLink = from([
  new RetryLink(),
  new HttpLink({
    uri: "http://localhost:8010/graphql",
    credentials: "include",
  }),
]);
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: cache,
  link: splitLink,
  queryDeduplication: false,
  defaultOptions: {
    mutate: {
      fetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
    },
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
  credentials: "include",
});

export { client };
