import gql from "graphql-tag";

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
