import gql from "graphql-tag";

export default gql`
  type Query {
    user: User
  }
  type Mutation {
    login(username: String!, password: String!): User
  }
  type User {
    username: String!
    isAdmin: Boolean!
  }
`;
