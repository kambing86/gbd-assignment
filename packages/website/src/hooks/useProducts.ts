import {
  LazyQueryResult,
  gql,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { useCallback, useEffect } from "react";

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

const PRODUCTS_SUBSCRIPTION = gql`
  subscription products {
    products {
      id
      name
      quantity
      price
      isUp
    }
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

const mapOldToNewProduct = (oldProduct: Product, newProduct: Product) => {
  if (oldProduct.id === newProduct.id) {
    return newProduct;
  }
  return oldProduct;
};

export const useGetProducts = (): [
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
  const { subscribeToMore, loading, called } = productsResult;
  useEffect(() => {
    if (called && !loading && subscribeToMore) {
      subscribeToMore({
        document: PRODUCTS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const newProduct = subscriptionData.data.products as Product;
          return {
            ...prev,
            products: {
              ...prev.products,
              rows: prev.products.rows.map((old) =>
                mapOldToNewProduct(old, newProduct),
              ),
            },
          };
        },
      });
    }
  }, [subscribeToMore, loading, called]);
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
