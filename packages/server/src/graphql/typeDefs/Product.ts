import gql from "graphql-tag";

export default gql`
  type Query {
    products(skip: Int = 0, limit: Int = 10): [Product!]!
    productsOnShelf(skip: Int = 0, limit: Int = 10): [Product!]!
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
