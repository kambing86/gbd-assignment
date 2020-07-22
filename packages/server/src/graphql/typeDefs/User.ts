import gql from "graphql-tag";

const User = gql`
  type Query {
    user(username: String!, password: String!): User
  }
  type User {
    username: String!
    isAdmin: Boolean!
  }
`;

export default User;
