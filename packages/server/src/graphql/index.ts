import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./typeDefs")),
);

const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers")),
);

export { resolvers, typeDefs };
