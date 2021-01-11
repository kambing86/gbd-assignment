import { PRODUCTS_SUBSCRIPTION } from "graphql/documents/product";
import {
  GraphQLProduct,
  GraphQLProductsSubscription,
  useGetProductsLazyQuery,
  useProductsByIdsLazyQuery,
  useUpdateProductMutation,
} from "graphql/types-and-hooks";
import produce from "immer";
import { useCallback, useEffect } from "react";

export type Product = GraphQLProduct;

const mapOldToNewProduct = (oldProduct: Product, newProduct: Product) => {
  if (oldProduct.id === newProduct.id) {
    return newProduct;
  }
  return oldProduct;
};

// onShelf is for initialize only
export const useGetProducts = (onShelf?: boolean) => {
  const [query, result] = useGetProductsLazyQuery();
  const getProducts = useCallback(
    (skip: number, limit: number) => {
      query({
        variables: {
          skip,
          limit,
          onShelf,
        },
      });
    },
    [query, onShelf],
  );
  const { subscribeToMore, loading, called } = result;
  useEffect(() => {
    if (called && !loading && subscribeToMore) {
      subscribeToMore<GraphQLProductsSubscription>({
        document: PRODUCTS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          const newProduct = subscriptionData.data.products;
          let rows = prev.products.rows.map((old) =>
            mapOldToNewProduct(old, newProduct),
          );
          if (onShelf) {
            rows = rows.filter((r) => r.isUp);
          }
          return produce(prev, (state) => {
            state.products.rows = rows;
          });
        },
      });
    }
  }, [subscribeToMore, loading, called, onShelf]);
  return { result, getProducts };
};

export const useUpdateProduct = () => {
  const [mutation, result] = useUpdateProductMutation();
  const updateProduct = useCallback(
    async (product: Product) => {
      await mutation({
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

export const useGetProductsByIds = () => {
  const [query, result] = useProductsByIdsLazyQuery();
  const { called, loading, subscribeToMore } = result;
  useEffect(() => {
    if (called && !loading && subscribeToMore) {
      subscribeToMore<GraphQLProductsSubscription>({
        document: PRODUCTS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          const newProduct = subscriptionData.data.products;
          return produce(prev, (state) => {
            state.products = state.products.map((old) =>
              mapOldToNewProduct(old, newProduct),
            );
          });
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
  return { result, getProductsByIds };
};
