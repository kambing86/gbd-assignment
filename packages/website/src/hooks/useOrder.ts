import {
  LazyQueryResult,
  MutationResult,
  gql,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { useCallback } from "react";
import { Cart } from "./useCart";

const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrderInput!) {
    createOrder(data: $data)
  }
`;

interface CreateOrderData {
  createOrder: boolean;
}

export const useCreateOrder = (): [
  MutationResult<CreateOrderData>,
  (cart: Cart) => void,
] => {
  const [mutation, result] = useMutation<CreateOrderData>(CREATE_ORDER, {
    fetchPolicy: "no-cache",
  });
  const createOrder = useCallback(
    (cart: Cart) => {
      const payload = Object.entries(cart).map(([id, quantity]) => ({
        productId: Number(id),
        quantity,
      }));
      if (payload.length === 0) return;
      mutation({
        variables: {
          data: {
            details: payload,
          },
        },
      });
    },
    [mutation],
  );
  return [result, createOrder];
};

const GET_ORDERS = gql`
  query GetOrders($skip: Int!, $limit: Int!) {
    orders(skip: $skip, limit: $limit) {
      rows {
        id
        createdDate
        details {
          product {
            id
          }
          quantity
          price
        }
      }
      skip
      limit
      total
    }
  }
`;

export type GetOrdersData = {
  orders: {
    rows: Order[];
    skip: number;
    limit: number;
    total: number;
  };
};

export interface Order {
  id: number;
  createdDate: string;
  details: OrderDetail[];
}

interface OrderDetail {
  product: {
    id: number;
  };
  quantity: number;
  price: number;
}

export const getTotalAmount = (order: Order) => {
  let amount = 0;
  const { details } = order;
  for (const detail of details) {
    amount += detail.price * detail.quantity;
  }
  return amount;
};

export const useGetOrders = (): [
  LazyQueryResult<
    GetOrdersData,
    {
      skip: number;
      limit: number;
    }
  >,
  (skip: number, limit: number) => void,
] => {
  const [query, result] = useLazyQuery<
    GetOrdersData,
    { skip: number; limit: number }
  >(GET_ORDERS);
  const getOrders = useCallback(
    (skip: number, limit: number) => {
      query({
        variables: {
          skip,
          limit,
        },
      });
    },
    [query],
  );
  return [result, getOrders];
};
