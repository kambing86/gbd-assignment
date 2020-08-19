import { GraphQLGetProductsQuery } from "graphql/types-and-hooks";
import produce from "immer";
import { useCallback, useEffect, useMemo } from "react";
import create from "zustand";
import { RowsData, usePaginatedQuery } from "./helpers/usePaginatedQuery";
import { Product, useGetProducts } from "./useProducts";

interface ProductState {
  [key: number]: Product | undefined;
}

interface Store {
  productState: ProductState;
}

const useStore = create<Store>(() => ({
  productState: {},
}));

const setProduct = (product: Product) => {
  const { id } = product;
  const prev = useStore.getState().productState[id];
  if (prev !== product) {
    useStore.setState(
      produce((state) => {
        state.productState[id] = product;
      }),
    );
  }
};

const useGetProduct = (id: number) => {
  return useStore(useCallback((store: Store) => store.productState[id], [id]));
};

interface options {
  itemsPerPage: number;
  productClicked?: (product?: Product, action?: string) => void;
  onShelfOnly?: boolean;
}

// onShelfOnly is for initialize only
export const usePaginatedProducts = ({
  itemsPerPage,
  productClicked,
  onShelfOnly,
}: options) => {
  const mapData = useCallback((queryData: GraphQLGetProductsQuery): RowsData<
    Product
  > => {
    return queryData.products;
  }, []);
  const result = usePaginatedQuery({
    itemsPerPage,
    paginatedQuery: useGetProducts(onShelfOnly),
    mapData,
    dataClicked: productClicked,
  });
  const { rowsData } = result;
  useEffect(() => {
    if (rowsData === undefined) return;
    for (const product of rowsData.rows) {
      setProduct(product);
    }
  }, [rowsData]);
  const idsChange = JSON.stringify(rowsData?.rows.map((r) => r.id));
  const productIds = useMemo(() => {
    return rowsData?.rows.map((r) => r.id) || [];
  }, [idsChange]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...result, productIds, useGetProduct };
};
