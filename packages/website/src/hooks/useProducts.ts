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

const PRODUCTS_ON_SHELF = gql`
  query Products($skip: Int!, $limit: Int!) {
    products: productsOnShelf(skip: $skip, limit: $limit) {
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

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: Int!, $data: ProductInput!) {
    updateProduct(id: $id, data: $data)
  }
`;

export const PRODUCTS_SUBSCRIPTION = gql`
  subscription products {
    products {
      id
      name
      image
      quantity
      price
      isUp
    }
  }
`;

export interface Product {
  id: number;
  name: string;
  image: string | null;
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

export const mapOldToNewProduct = (
  oldProduct: Product,
  newProduct: Product,
) => {
  if (oldProduct.id === newProduct.id) {
    return newProduct;
  }
  return oldProduct;
};

// onShelfOnly is for initialize only
export const useGetProducts = (
  onShelfOnly?: boolean,
): [
  LazyQueryResult<QueryData, { skip: number; limit: number }>,
  (skip: number, limit: number) => void,
] => {
  const [productsQuery, productsResult] = useLazyQuery<
    QueryData,
    { skip: number; limit: number }
  >(onShelfOnly ? PRODUCTS_ON_SHELF : PRODUCTS);
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
          let rows = prev.products.rows.map((old) =>
            mapOldToNewProduct(old, newProduct),
          );
          if (onShelfOnly) {
            rows = rows.filter((r) => r.isUp);
          }
          return {
            ...prev,
            products: {
              ...prev.products,
              rows,
            },
          };
        },
      });
    }
  }, [subscribeToMore, loading, called]); // eslint-disable-line react-hooks/exhaustive-deps
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
