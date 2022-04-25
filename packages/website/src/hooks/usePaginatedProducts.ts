import { GraphQLGetProductsQuery } from "graphql/types-and-hooks";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { productActions } from "store/slices/product.slice";
import { RowsData, usePaginatedQuery } from "./helpers/usePaginatedQuery";
import { Product, useGetProducts } from "./useProducts";

interface options {
  itemsPerPage: number;
  dataClicked?: (data?: Product, action?: string) => void;
  onShelfOnly?: boolean;
}

// onShelfOnly is for initialize only
export const usePaginatedProducts = ({
  itemsPerPage,
  dataClicked,
  onShelfOnly,
}: options) => {
  const mapData = useCallback(
    (queryData: GraphQLGetProductsQuery): RowsData<Product> => {
      return queryData.products;
    },
    [],
  );
  const { result, getProducts } = useGetProducts(onShelfOnly);
  const paginatedResult = usePaginatedQuery({
    itemsPerPage,
    paginatedResult: result,
    paginatedQuery: getProducts,
    mapData,
    dataClicked,
  });
  const { rowsData } = paginatedResult;
  const dispatch = useDispatch();
  useEffect(() => {
    if (rowsData === undefined) return;
    dispatch(productActions.setProducts(rowsData.rows));
  }, [rowsData, dispatch]);
  const idsChange = JSON.stringify(rowsData?.rows.map((r) => r.id));
  const productIds = useMemo(() => {
    return rowsData?.rows.map((r) => r.id) || [];
  }, [idsChange]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...paginatedResult, productIds };
};
