import gql from "graphql-tag";

export default gql`
  type Query {
    orders(skip: Int = 0, limit: Int = 10): [Order!]!
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
