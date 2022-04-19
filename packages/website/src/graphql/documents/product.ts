import { gql } from "@apollo/client";

export const GetProducts = gql`
  query getProducts($skip: Int!, $limit: Int!, $onShelf: Boolean) {
    products(skip: $skip, limit: $limit, onShelf: $onShelf) {
      rows {
        id
        name
        image
        quantity
        price
        isUp
      }
      skip
      limit
      total
    }
  }
`;

export const PRODUCTS_BY_IDS = gql`
  query ProductsByIds($ids: [Int!]!) {
    products: productsByIds(ids: $ids) {
      id
      name
      image
      quantity
      price
      isUp
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $data: ProductInput!) {
    updateProduct(id: $id, data: $data)
  }
`;

export const PRODUCT_UPDATED_SUBSCRIPTION = gql`
  subscription products {
    productUpdated {
      id
      name
      image
      quantity
      price
      isUp
    }
  }
`;
