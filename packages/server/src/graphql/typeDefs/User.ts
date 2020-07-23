import gql from "graphql-tag";

export default gql`
  type Query {
    user: User
  }
  type Mutation {
    login(username: String!, password: String!): String
  }
  type User {
    username: String!
    isAdmin: Boolean!
  }
`;
