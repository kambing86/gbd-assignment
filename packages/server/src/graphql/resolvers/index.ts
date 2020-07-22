import { mergeResolvers } from "graphql-tools";
import Product from "./Product";
import User from "./User";

export default mergeResolvers([Product, User]);
