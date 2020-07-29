import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUser {
    user {
      username
      isAdmin
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      isAdmin
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;
