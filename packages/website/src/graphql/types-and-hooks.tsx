/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GraphQLMutation = {
  __typename?: 'Mutation';
  addProduct?: Maybe<Scalars['Boolean']>;
  createOrder?: Maybe<Scalars['Boolean']>;
  login?: Maybe<GraphQLUser>;
  logout: Scalars['Boolean'];
  updateProduct?: Maybe<Scalars['Boolean']>;
};


export type GraphQLMutationAddProductArgs = {
  data: GraphQLProductInput;
};


export type GraphQLMutationCreateOrderArgs = {
  data: GraphQLOrderInput;
};


export type GraphQLMutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type GraphQLMutationUpdateProductArgs = {
  data: GraphQLProductInput;
  id: Scalars['Int'];
};

export type GraphQLOrder = {
  __typename?: 'Order';
  createdDate: Scalars['String'];
  details: Array<GraphQLOrderDetail>;
  id: Scalars['Int'];
  userId: Scalars['Int'];
};

export type GraphQLOrderDetail = {
  __typename?: 'OrderDetail';
  price: Scalars['Float'];
  product: GraphQLProduct;
  quantity: Scalars['Int'];
};

export type GraphQLOrderDetailInput = {
  productId: Scalars['Int'];
  quantity: Scalars['Int'];
};

export type GraphQLOrderInput = {
  details: Array<GraphQLOrderDetailInput>;
};

export type GraphQLOrderResult = {
  __typename?: 'OrderResult';
  limit: Scalars['Int'];
  rows: Array<GraphQLOrder>;
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type GraphQLProduct = {
  __typename?: 'Product';
  id: Scalars['Int'];
  image?: Maybe<Scalars['String']>;
  isUp: Scalars['Boolean'];
  name: Scalars['String'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
};

export type GraphQLProductInput = {
  image?: InputMaybe<Scalars['String']>;
  isUp?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  quantity?: InputMaybe<Scalars['Int']>;
};

export type GraphQLProductResult = {
  __typename?: 'ProductResult';
  limit: Scalars['Int'];
  rows: Array<GraphQLProduct>;
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type GraphQLQuery = {
  __typename?: 'Query';
  orders: GraphQLOrderResult;
  products: GraphQLProductResult;
  productsByIds: Array<GraphQLProduct>;
  user?: Maybe<GraphQLUser>;
};


export type GraphQLQueryOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type GraphQLQueryProductsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  onShelf?: InputMaybe<Scalars['Boolean']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type GraphQLQueryProductsByIdsArgs = {
  ids: Array<Scalars['Int']>;
};

export type GraphQLSubscription = {
  __typename?: 'Subscription';
  orderCreated: GraphQLOrder;
  productUpdated: GraphQLProduct;
};


export type GraphQLSubscriptionOrderCreatedArgs = {
  id?: InputMaybe<Scalars['Int']>;
};


export type GraphQLSubscriptionProductUpdatedArgs = {
  id?: InputMaybe<Scalars['Int']>;
};

export type GraphQLUser = {
  __typename?: 'User';
  isAdmin: Scalars['Boolean'];
  username: Scalars['String'];
};

export type GraphQLCreateOrderMutationVariables = Exact<{
  data: GraphQLOrderInput;
}>;


export type GraphQLCreateOrderMutation = { __typename?: 'Mutation', createOrder?: boolean | null };

export type GraphQLGetOrdersQueryVariables = Exact<{
  skip: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type GraphQLGetOrdersQuery = { __typename?: 'Query', orders: { __typename?: 'OrderResult', skip: number, limit: number, total: number, rows: Array<{ __typename?: 'Order', id: number, createdDate: string, details: Array<{ __typename?: 'OrderDetail', quantity: number, price: number, product: { __typename?: 'Product', id: number } }> }> } };

export type GraphQLOrdersSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GraphQLOrdersSubscription = { __typename?: 'Subscription', orderCreated: { __typename?: 'Order', id: number, createdDate: string, details: Array<{ __typename?: 'OrderDetail', quantity: number, price: number, product: { __typename?: 'Product', id: number } }> } };

export type GraphQLGetProductsQueryVariables = Exact<{
  skip: Scalars['Int'];
  limit: Scalars['Int'];
  onShelf?: InputMaybe<Scalars['Boolean']>;
}>;


export type GraphQLGetProductsQuery = { __typename?: 'Query', products: { __typename?: 'ProductResult', skip: number, limit: number, total: number, rows: Array<{ __typename?: 'Product', id: number, name: string, image?: string | null, quantity: number, price: number, isUp: boolean }> } };

export type GraphQLProductsByIdsQueryVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type GraphQLProductsByIdsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Product', id: number, name: string, image?: string | null, quantity: number, price: number, isUp: boolean }> };

export type GraphQLUpdateProductMutationVariables = Exact<{
  id: Scalars['Int'];
  data: GraphQLProductInput;
}>;


export type GraphQLUpdateProductMutation = { __typename?: 'Mutation', updateProduct?: boolean | null };

export type GraphQLProductsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GraphQLProductsSubscription = { __typename?: 'Subscription', productUpdated: { __typename?: 'Product', id: number, name: string, image?: string | null, quantity: number, price: number, isUp: boolean } };

export type GraphQLGetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GraphQLGetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', username: string, isAdmin: boolean } | null };

export type GraphQLLoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type GraphQLLoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', username: string, isAdmin: boolean } | null };

export type GraphQLLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type GraphQLLogoutMutation = { __typename?: 'Mutation', logout: boolean };


export const CreateOrderDocument = gql`
    mutation CreateOrder($data: OrderInput!) {
  createOrder(data: $data)
}
    `;
export type GraphQLCreateOrderMutationFn = Apollo.MutationFunction<GraphQLCreateOrderMutation, GraphQLCreateOrderMutationVariables>;

/**
 * __useCreateOrderMutation__
 *
 * To run a mutation, you first call `useCreateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrderMutation, { data, loading, error }] = useCreateOrderMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateOrderMutation(baseOptions?: Apollo.MutationHookOptions<GraphQLCreateOrderMutation, GraphQLCreateOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GraphQLCreateOrderMutation, GraphQLCreateOrderMutationVariables>(CreateOrderDocument, options);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = Apollo.MutationResult<GraphQLCreateOrderMutation>;
export type CreateOrderMutationOptions = Apollo.BaseMutationOptions<GraphQLCreateOrderMutation, GraphQLCreateOrderMutationVariables>;
export const GetOrdersDocument = gql`
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

/**
 * __useGetOrdersQuery__
 *
 * To run a query within a React component, call `useGetOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrdersQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetOrdersQuery(baseOptions: Apollo.QueryHookOptions<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>(GetOrdersDocument, options);
      }
export function useGetOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>(GetOrdersDocument, options);
        }
export type GetOrdersQueryHookResult = ReturnType<typeof useGetOrdersQuery>;
export type GetOrdersLazyQueryHookResult = ReturnType<typeof useGetOrdersLazyQuery>;
export type GetOrdersQueryResult = Apollo.QueryResult<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>;
export function refetchGetOrdersQuery(variables: GraphQLGetOrdersQueryVariables) {
      return { query: GetOrdersDocument, variables: variables }
    }
export const OrdersDocument = gql`
    subscription orders {
  orderCreated {
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
}
    `;

/**
 * __useOrdersSubscription__
 *
 * To run a query within a React component, call `useOrdersSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOrdersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrdersSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOrdersSubscription(baseOptions?: Apollo.SubscriptionHookOptions<GraphQLOrdersSubscription, GraphQLOrdersSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GraphQLOrdersSubscription, GraphQLOrdersSubscriptionVariables>(OrdersDocument, options);
      }
export type OrdersSubscriptionHookResult = ReturnType<typeof useOrdersSubscription>;
export type OrdersSubscriptionResult = Apollo.SubscriptionResult<GraphQLOrdersSubscription>;
export const GetProductsDocument = gql`
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

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      limit: // value for 'limit'
 *      onShelf: // value for 'onShelf'
 *   },
 * });
 */
export function useGetProductsQuery(baseOptions: Apollo.QueryHookOptions<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>(GetProductsDocument, options);
      }
export function useGetProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>(GetProductsDocument, options);
        }
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsQueryResult = Apollo.QueryResult<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>;
export function refetchGetProductsQuery(variables: GraphQLGetProductsQueryVariables) {
      return { query: GetProductsDocument, variables: variables }
    }
export const ProductsByIdsDocument = gql`
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

/**
 * __useProductsByIdsQuery__
 *
 * To run a query within a React component, call `useProductsByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsByIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsByIdsQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useProductsByIdsQuery(baseOptions: Apollo.QueryHookOptions<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>(ProductsByIdsDocument, options);
      }
export function useProductsByIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>(ProductsByIdsDocument, options);
        }
export type ProductsByIdsQueryHookResult = ReturnType<typeof useProductsByIdsQuery>;
export type ProductsByIdsLazyQueryHookResult = ReturnType<typeof useProductsByIdsLazyQuery>;
export type ProductsByIdsQueryResult = Apollo.QueryResult<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>;
export function refetchProductsByIdsQuery(variables: GraphQLProductsByIdsQueryVariables) {
      return { query: ProductsByIdsDocument, variables: variables }
    }
export const UpdateProductDocument = gql`
    mutation UpdateProduct($id: Int!, $data: ProductInput!) {
  updateProduct(id: $id, data: $data)
}
    `;
export type GraphQLUpdateProductMutationFn = Apollo.MutationFunction<GraphQLUpdateProductMutation, GraphQLUpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<GraphQLUpdateProductMutation, GraphQLUpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GraphQLUpdateProductMutation, GraphQLUpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<GraphQLUpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<GraphQLUpdateProductMutation, GraphQLUpdateProductMutationVariables>;
export const ProductsDocument = gql`
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

/**
 * __useProductsSubscription__
 *
 * To run a query within a React component, call `useProductsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useProductsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useProductsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<GraphQLProductsSubscription, GraphQLProductsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GraphQLProductsSubscription, GraphQLProductsSubscriptionVariables>(ProductsDocument, options);
      }
export type ProductsSubscriptionHookResult = ReturnType<typeof useProductsSubscription>;
export type ProductsSubscriptionResult = Apollo.SubscriptionResult<GraphQLProductsSubscription>;
export const GetUserDocument = gql`
    query getUser {
  user {
    username
    isAdmin
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>;
export function refetchGetUserQuery(variables?: GraphQLGetUserQueryVariables) {
      return { query: GetUserDocument, variables: variables }
    }
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    username
    isAdmin
  }
}
    `;
export type GraphQLLoginMutationFn = Apollo.MutationFunction<GraphQLLoginMutation, GraphQLLoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<GraphQLLoginMutation, GraphQLLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GraphQLLoginMutation, GraphQLLoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<GraphQLLoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<GraphQLLoginMutation, GraphQLLoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type GraphQLLogoutMutationFn = Apollo.MutationFunction<GraphQLLogoutMutation, GraphQLLogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<GraphQLLogoutMutation, GraphQLLogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GraphQLLogoutMutation, GraphQLLogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<GraphQLLogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<GraphQLLogoutMutation, GraphQLLogoutMutationVariables>;