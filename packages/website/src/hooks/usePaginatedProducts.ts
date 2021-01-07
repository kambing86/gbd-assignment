import { GraphQLGetProductsQuery } from "graphql/types-and-hooks";
import { useCallback, useEffect, useMemo } from "react";
import { setProduct, useGetProduct } from "state/useProductStore";
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
  const result = usePaginatedQuery({
    itemsPerPage,
    paginatedQuery: useGetProducts(onShelfOnly),
    mapData,
    dataClicked,
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
