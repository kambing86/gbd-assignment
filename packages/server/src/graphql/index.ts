import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { Resolvers } from "~/types/graphql";

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./typeDefs")),
);

const resolvers: Resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers")) as Resolvers,
);

export { resolvers, typeDefs };
