import { LazyQueryResult, MutationResult } from "@apollo/client";
import { PRODUCTS_SUBSCRIPTION } from "graphql/documents/product";
import {
  Exact,
  GraphQLGetProductsQuery,
  GraphQLProduct,
  GraphQLProductsByIdsQuery,
  GraphQLUpdateProductMutation,
  useGetProductsLazyQuery,
  useProductsByIdsLazyQuery,
  useUpdateProductMutation,
} from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";

export type Product = GraphQLProduct;

const mapOldToNewProduct = (oldProduct: Product, newProduct: Product) => {
  if (oldProduct.id === newProduct.id) {
    return newProduct;
  }
  return oldProduct;
};

// onShelf is for initialize only
export const useGetProducts = (
  onShelf?: boolean,
): [
  LazyQueryResult<
    GraphQLGetProductsQuery,
    Exact<{
      skip: number;
      limit: number;
      onShelf?: boolean | null | undefined;
    }>
  >,
  (skip: number, limit: number) => void,
] => {
  const [productsQuery, productsResult] = useGetProductsLazyQuery();
  const getProducts = useCallback(
    (skip: number, limit: number) => {
      productsQuery({
        variables: {
          skip,
          limit,
          onShelf,
        },
      });
    },
    [productsQuery, onShelf],
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
          if (onShelf) {
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
  }, [subscribeToMore, loading, called, onShelf]);
  return [productsResult, getProducts];
};

export const useUpdateProduct = (): [
  MutationResult<GraphQLUpdateProductMutation>,
  (product: Product) => void,
] => {
  const [mutation, result] = useUpdateProductMutation();
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
  return [result, updateProduct];
};

export const useGetProductsByIds = (): [
  LazyQueryResult<
    GraphQLProductsByIdsQuery,
    Exact<{
      ids: number[];
    }>
  >,
  (ids: number[]) => void,
] => {
  const [query, result] = useProductsByIdsLazyQuery();
  const { called, loading, subscribeToMore } = result;
  useEffect(() => {
    if (called && !loading && subscribeToMore) {
      subscribeToMore({
        document: PRODUCTS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const newProduct = subscriptionData.data.products as Product;
          return {
            products: prev.products.map((old) =>
              mapOldToNewProduct(old, newProduct),
            ),
          };
        },
      });
    }
  }, [called, loading, subscribeToMore]);
  const getProductsByIds = useCallback(
    (ids: number[]) => {
      query({ variables: { ids } });
    },
    [query],
  );
  return [result, getProductsByIds];
};
