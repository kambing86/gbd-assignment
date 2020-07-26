import gql from "graphql-tag";

export default gql`
  type Query {
    products(skip: Int = 0, limit: Int = 10): ProductResult!
    productsOnShelf(skip: Int = 0, limit: Int = 10): ProductResult!
    productsByIds(ids: [Int!]!): [Product!]!
  }
  type Mutation {
    addProduct(data: ProductInput!): Boolean
    updateProduct(id: Int!, data: ProductInput!): Boolean
  }
  type Subscription {
    products: Product!
    product(id: Int!): Product!
  }
  type ProductResult {
    rows: [Product!]!
    skip: Int!
    limit: Int!
    total: Int!
  }
  type Product {
    id: Int!
    name: String!
    image: String
    quantity: Int!
    price: Float!
    isUp: Boolean!
  }
  input ProductInput {
    name: String
    image: String
    quantity: Int
    price: Float
    isUp: Boolean
  }
`;
