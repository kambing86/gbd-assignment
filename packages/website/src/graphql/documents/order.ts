import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrderInput!) {
    createOrder(data: $data)
  }
`;

export const GET_ORDERS = gql`
  query GetOrders($skip: Int!, $limit: Int!) {
    orders(skip: $skip, limit: $limit) {
      rows {
        id
        createdDate
        details {
          product {
            id
          }
          quantity
          price
        }
      }
      skip
      limit
      total
    }
  }
`;
