import {
  GraphQLGetOrdersQuery,
  useCreateOrderMutation,
  useGetOrdersLazyQuery,
} from "graphql/types-and-hooks";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { ValuesType } from "utility-types";
import { Cart } from "./useCart";
import { Product, useGetProductsByIds } from "./useProducts";

export type Order = ValuesType<GraphQLGetOrdersQuery["orders"]["rows"]>;

export const useCreateOrder = () => {
  const [mutation, result] = useCreateOrderMutation({
    fetchPolicy: "no-cache",
  });
  const createOrder = useCallback(
    async (cart: Cart) => {
      const payload = Object.entries(cart).map(([id, quantity]) => ({
        productId: Number(id),
        quantity: quantity as number,
      }));
      if (payload.length === 0) return;
      await mutation({
        variables: {
          data: {
            details: payload,
          },
        },
      });
    },
    [mutation],
  );
  return { result, createOrder };
};

export const getLocalDate = (date: string) => {
  return moment.utc(date).local().format("YYYY-MM-DD hh:mm:ss A");
};

export const getTotalAmount = (order: Order) => {
  let amount = 0;
  const { details } = order;
  for (const detail of details) {
    amount += detail.price * detail.quantity;
  }
  return amount;
};

export const useGetOrders = () => {
  const [query, result] = useGetOrdersLazyQuery();
  const getOrders = useCallback(
    (skip: number, limit: number) => {
      void query({
        variables: {
          skip,
          limit,
        },
      });
    },
    [query],
  );
  return { result, getOrders };
};

export const useGetOrderDetails = (order: Order) => {
  const { result, getProductsByIds } = useGetProductsByIds();
  const [productDetails, setProductDetails] = useState<Product[]>();
  useEffect(() => {
    const ids = order.details.map((d) => d.product.id);
    getProductsByIds(ids);
  }, [order, getProductsByIds]);
  const { loading, data } = result;
  useEffect(() => {
    if (!loading && data) {
      const details = data.products.map((p) => {
        const detail = order.details.find((d) => d.product.id === p.id);
        return {
          ...p,
          quantity: detail?.quantity ?? 0,
          price: detail?.price ?? 0,
        };
      });
      setProductDetails(details);
    }
  }, [loading, data, order]);
  return { productDetails, loading };
};
