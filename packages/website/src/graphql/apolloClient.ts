import { ApolloClient, HttpLink, from, split } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { RetryLink } from "@apollo/client/link/retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const cache = new InMemoryCache();
const wsLink = new WebSocketLink({
  uri: `ws://localhost:8010/graphql`,
  options: {
    reconnect: true,
  },
});
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
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
  credentials: "include",
});

export { client };
