import {
  LazyQueryResult,
  gql,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { useCallback } from "react";

const PRODUCTS = gql`
  query Products($skip: Int!, $limit: Int!) {
    products(skip: $skip, limit: $limit) {
      rows {
        id
        name
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

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $data: ProductInput!) {
    updateProduct(id: $id, data: $data)
  }
`;

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  isUp: boolean;
}

interface QueryData {
  products: {
    rows: Product[];
    skip: number;
    limit: number;
    total: number;
  };
}

export const useProducts = (): [
  LazyQueryResult<QueryData, { skip: number; limit: number }>,
  (skip: number, limit: number) => void,
] => {
  const [productsQuery, productsResult] = useLazyQuery<
    QueryData,
    { skip: number; limit: number }
  >(PRODUCTS);
  const getProducts = useCallback(
    (skip: number, limit: number) => {
      productsQuery({
        variables: {
          skip,
          limit,
        },
      });
    },
    [productsQuery],
  );
  return [productsResult, getProducts];
};

export const useUpdateProduct = () => {
  const [mutation, result] = useMutation(UPDATE_PRODUCT);
  const updateProduct = useCallback(
    (product: Product) => {
      mutation({
        variables: {
          id: product.id,
          data: {
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            isUp: product.isUp,
          },
        },
      });
    },
    [mutation],
  );
  return { result, updateProduct };
};
