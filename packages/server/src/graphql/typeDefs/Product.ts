import gql from "graphql-tag";

export default gql`
  type Query {
    products(skip: Int!, limit: Int!): [Product!]!
    productsOnShelf(skip: Int!, limit: Int!): [Product!]!
  }
  type Mutation {
    updateProduct(id: Int!, data: ProductInput!): Boolean
  }
  type Subscription {
    products: Product!
    product(id: Int!): Product!
  }
  type Product {
    id: Int!
    name: String!
    quantity: Int!
    price: Float!
    isUp: Boolean!
  }
  input ProductInput {
    name: String
    quantity: Int
    price: Float
    isUp: Boolean
  }
`;
