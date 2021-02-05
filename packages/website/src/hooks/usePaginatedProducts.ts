import { GraphQLGetProductsQuery } from "graphql/types-and-hooks";
import { useCallback, useEffect, useMemo } from "react";
import { dispatch } from "store";
import { useGetProduct } from "store/selectors/product";
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
  useEffect(() => {
    if (rowsData === undefined) return;
    dispatch.product.setProducts(rowsData.rows);
  }, [rowsData]);
  const idsChange = JSON.stringify(rowsData?.rows.map((r) => r.id));
  const productIds = useMemo(() => {
    return rowsData?.rows.map((r) => r.id) || [];
  }, [idsChange]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...paginatedResult, productIds, useGetProduct };
};
