import { mergeTypeDefs } from "graphql-tools";
import Product from "./Product";
import User from "./User";

export default mergeTypeDefs([Product, User]);
