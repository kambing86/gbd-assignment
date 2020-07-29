import { gql } from "apollo-server-express";

export default gql`
  type Query {
    user: User
  }
  type Mutation {
    login(username: String!, password: String!): User
    logout: Boolean!
  }
  type User {
    username: String!
    isAdmin: Boolean!
  }
`;
