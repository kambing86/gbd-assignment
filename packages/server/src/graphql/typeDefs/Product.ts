import gql from "graphql-tag";

const Product = gql`
  type Query {
    products: [Product!]!
  }
  type Product {
    name: String!
    quantity: Int!
    price: Float!
    isUp: Boolean!
  }
`;

export default Product;
