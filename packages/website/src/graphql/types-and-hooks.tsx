/* eslint-disable */
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GraphQLQuery = {
  __typename?: 'Query';
  orders: GraphQLOrderResult;
  products: GraphQLProductResult;
  productsByIds: Array<GraphQLProduct>;
  user?: Maybe<GraphQLUser>;
};


export type GraphQLQueryOrdersArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type GraphQLQueryProductsArgs = {
  skip?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  onShelf?: Maybe<Scalars['Boolean']>;
};


export type GraphQLQueryProductsByIdsArgs = {
  ids: Array<Scalars['Int']>;
};

export type GraphQLOrderResult = {
  __typename?: 'OrderResult';
  rows: Array<GraphQLOrder>;
  skip: Scalars['Int'];
  limit: Scalars['Int'];
  total: Scalars['Int'];
};

export type GraphQLOrder = {
  __typename?: 'Order';
  id: Scalars['Int'];
  userId: Scalars['Int'];
  createdDate: Scalars['String'];
  details: Array<GraphQLOrderDetail>;
};

export type GraphQLOrderDetail = {
  __typename?: 'OrderDetail';
  product: GraphQLProduct;
  quantity: Scalars['Int'];
  price: Scalars['Float'];
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
  username: Scalars['String'];
  password: Scalars['String'];
};


export type GraphQLMutationUpdateProductArgs = {
  id: Scalars['Int'];
  data: GraphQLProductInput;
};

export type GraphQLOrderInput = {
  details: Array<GraphQLOrderDetailInput>;
};

export type GraphQLOrderDetailInput = {
  productId: Scalars['Int'];
  quantity: Scalars['Int'];
};

export type GraphQLSubscription = {
  __typename?: 'Subscription';
  products: GraphQLProduct;
  product: GraphQLProduct;
};


export type GraphQLSubscriptionProductArgs = {
  id: Scalars['Int'];
};

export type GraphQLProductResult = {
  __typename?: 'ProductResult';
  rows: Array<GraphQLProduct>;
  skip: Scalars['Int'];
  limit: Scalars['Int'];
  total: Scalars['Int'];
};

export type GraphQLProduct = {
  __typename?: 'Product';
  id: Scalars['Int'];
  name: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  quantity: Scalars['Int'];
  price: Scalars['Float'];
  isUp: Scalars['Boolean'];
};

export type GraphQLProductInput = {
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Float']>;
  isUp?: Maybe<Scalars['Boolean']>;
};

export type GraphQLUser = {
  __typename?: 'User';
  username: Scalars['String'];
  isAdmin: Scalars['Boolean'];
};

export type GraphQLCreateOrderMutationVariables = Exact<{
  data: GraphQLOrderInput;
}>;


export type GraphQLCreateOrderMutation = (
  { __typename?: 'Mutation' }
  & Pick<GraphQLMutation, 'createOrder'>
);

export type GraphQLGetOrdersQueryVariables = Exact<{
  skip: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type GraphQLGetOrdersQuery = (
  { __typename?: 'Query' }
  & { orders: (
    { __typename?: 'OrderResult' }
    & Pick<GraphQLOrderResult, 'skip' | 'limit' | 'total'>
    & { rows: Array<(
      { __typename?: 'Order' }
      & Pick<GraphQLOrder, 'id' | 'createdDate'>
      & { details: Array<(
        { __typename?: 'OrderDetail' }
        & Pick<GraphQLOrderDetail, 'quantity' | 'price'>
        & { product: (
          { __typename?: 'Product' }
          & Pick<GraphQLProduct, 'id'>
        ) }
      )> }
    )> }
  ) }
);

export type GraphQLGetProductsQueryVariables = Exact<{
  skip: Scalars['Int'];
  limit: Scalars['Int'];
  onShelf?: Maybe<Scalars['Boolean']>;
}>;


export type GraphQLGetProductsQuery = (
  { __typename?: 'Query' }
  & { products: (
    { __typename?: 'ProductResult' }
    & Pick<GraphQLProductResult, 'skip' | 'limit' | 'total'>
    & { rows: Array<(
      { __typename?: 'Product' }
      & Pick<GraphQLProduct, 'id' | 'name' | 'image' | 'quantity' | 'price' | 'isUp'>
    )> }
  ) }
);

export type GraphQLProductsByIdsQueryVariables = Exact<{
  ids: Array<Scalars['Int']>;
}>;


export type GraphQLProductsByIdsQuery = (
  { __typename?: 'Query' }
  & { products: Array<(
    { __typename?: 'Product' }
    & Pick<GraphQLProduct, 'id' | 'name' | 'image' | 'quantity' | 'price' | 'isUp'>
  )> }
);

export type GraphQLUpdateProductMutationVariables = Exact<{
  id: Scalars['Int'];
  data: GraphQLProductInput;
}>;


export type GraphQLUpdateProductMutation = (
  { __typename?: 'Mutation' }
  & Pick<GraphQLMutation, 'updateProduct'>
);

export type GraphQLProductsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GraphQLProductsSubscription = (
  { __typename?: 'Subscription' }
  & { products: (
    { __typename?: 'Product' }
    & Pick<GraphQLProduct, 'id' | 'name' | 'image' | 'quantity' | 'price' | 'isUp'>
  ) }
);

export type GraphQLGetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GraphQLGetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<GraphQLUser, 'username' | 'isAdmin'>
  )> }
);

export type GraphQLLoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type GraphQLLoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'User' }
    & Pick<GraphQLUser, 'username' | 'isAdmin'>
  )> }
);

export type GraphQLLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type GraphQLLogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<GraphQLMutation, 'logout'>
);


export const CreateOrderDocument = gql`
    mutation CreateOrder($data: OrderInput!) {
  createOrder(data: $data)
}
    `;
export type GraphQLCreateOrderMutationFn = ApolloReactCommon.MutationFunction<GraphQLCreateOrderMutation, GraphQLCreateOrderMutationVariables>;

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
export function useCreateOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GraphQLCreateOrderMutation, GraphQLCreateOrderMutationVariables>) {
        return ApolloReactHooks.useMutation<GraphQLCreateOrderMutation, GraphQLCreateOrderMutationVariables>(CreateOrderDocument, baseOptions);
      }
export type CreateOrderMutationHookResult = ReturnType<typeof useCreateOrderMutation>;
export type CreateOrderMutationResult = ApolloReactCommon.MutationResult<GraphQLCreateOrderMutation>;
export type CreateOrderMutationOptions = ApolloReactCommon.BaseMutationOptions<GraphQLCreateOrderMutation, GraphQLCreateOrderMutationVariables>;
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
export function useGetOrdersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>) {
        return ApolloReactHooks.useQuery<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>(GetOrdersDocument, baseOptions);
      }
export function useGetOrdersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>(GetOrdersDocument, baseOptions);
        }
export type GetOrdersQueryHookResult = ReturnType<typeof useGetOrdersQuery>;
export type GetOrdersLazyQueryHookResult = ReturnType<typeof useGetOrdersLazyQuery>;
export type GetOrdersQueryResult = ApolloReactCommon.QueryResult<GraphQLGetOrdersQuery, GraphQLGetOrdersQueryVariables>;
export function refetchGetOrdersQuery(variables?: GraphQLGetOrdersQueryVariables) {
      return { query: GetOrdersDocument, variables: variables }
    }
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
export function useGetProductsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>) {
        return ApolloReactHooks.useQuery<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>(GetProductsDocument, baseOptions);
      }
export function useGetProductsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>(GetProductsDocument, baseOptions);
        }
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsQueryResult = ApolloReactCommon.QueryResult<GraphQLGetProductsQuery, GraphQLGetProductsQueryVariables>;
export function refetchGetProductsQuery(variables?: GraphQLGetProductsQueryVariables) {
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
export function useProductsByIdsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>) {
        return ApolloReactHooks.useQuery<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>(ProductsByIdsDocument, baseOptions);
      }
export function useProductsByIdsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>(ProductsByIdsDocument, baseOptions);
        }
export type ProductsByIdsQueryHookResult = ReturnType<typeof useProductsByIdsQuery>;
export type ProductsByIdsLazyQueryHookResult = ReturnType<typeof useProductsByIdsLazyQuery>;
export type ProductsByIdsQueryResult = ApolloReactCommon.QueryResult<GraphQLProductsByIdsQuery, GraphQLProductsByIdsQueryVariables>;
export function refetchProductsByIdsQuery(variables?: GraphQLProductsByIdsQueryVariables) {
      return { query: ProductsByIdsDocument, variables: variables }
    }
export const UpdateProductDocument = gql`
    mutation UpdateProduct($id: Int!, $data: ProductInput!) {
  updateProduct(id: $id, data: $data)
}
    `;
export type GraphQLUpdateProductMutationFn = ApolloReactCommon.MutationFunction<GraphQLUpdateProductMutation, GraphQLUpdateProductMutationVariables>;

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
export function useUpdateProductMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GraphQLUpdateProductMutation, GraphQLUpdateProductMutationVariables>) {
        return ApolloReactHooks.useMutation<GraphQLUpdateProductMutation, GraphQLUpdateProductMutationVariables>(UpdateProductDocument, baseOptions);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = ApolloReactCommon.MutationResult<GraphQLUpdateProductMutation>;
export type UpdateProductMutationOptions = ApolloReactCommon.BaseMutationOptions<GraphQLUpdateProductMutation, GraphQLUpdateProductMutationVariables>;
export const ProductsDocument = gql`
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
export function useProductsSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<GraphQLProductsSubscription, GraphQLProductsSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<GraphQLProductsSubscription, GraphQLProductsSubscriptionVariables>(ProductsDocument, baseOptions);
      }
export type ProductsSubscriptionHookResult = ReturnType<typeof useProductsSubscription>;
export type ProductsSubscriptionResult = ApolloReactCommon.SubscriptionResult<GraphQLProductsSubscription>;
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
export function useGetUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>) {
        return ApolloReactHooks.useQuery<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>(GetUserDocument, baseOptions);
      }
export function useGetUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>(GetUserDocument, baseOptions);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = ApolloReactCommon.QueryResult<GraphQLGetUserQuery, GraphQLGetUserQueryVariables>;
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
export type GraphQLLoginMutationFn = ApolloReactCommon.MutationFunction<GraphQLLoginMutation, GraphQLLoginMutationVariables>;

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
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GraphQLLoginMutation, GraphQLLoginMutationVariables>) {
        return ApolloReactHooks.useMutation<GraphQLLoginMutation, GraphQLLoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<GraphQLLoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<GraphQLLoginMutation, GraphQLLoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type GraphQLLogoutMutationFn = ApolloReactCommon.MutationFunction<GraphQLLogoutMutation, GraphQLLogoutMutationVariables>;

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
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<GraphQLLogoutMutation, GraphQLLogoutMutationVariables>) {
        return ApolloReactHooks.useMutation<GraphQLLogoutMutation, GraphQLLogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<GraphQLLogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<GraphQLLogoutMutation, GraphQLLogoutMutationVariables>;