import { gql } from "apollo-server-express";

export default gql`
  type Query {
    orders(skip: Int = 0, limit: Int = 10): OrderResult!
  }
  type OrderResult {
    rows: [Order!]!
    skip: Int!
    limit: Int!
    total: Int!
  }
  type Order {
    id: Int!
    userId: Int!
    createdDate: String!
    details: [OrderDetail!]!
  }
  type OrderDetail {
    product: Product!
    quantity: Int!
    price: Float!
  }
  type Mutation {
    createOrder(data: OrderInput!): Boolean
  }
  input OrderInput {
    details: [OrderDetailInput!]!
  }
  input OrderDetailInput {
    productId: Int!
    quantity: Int!
  }
`;
