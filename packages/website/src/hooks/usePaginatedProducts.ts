import { useCallback } from "react";
import { GraphQLGetProductsQuery } from "../graphql/types-and-hooks";
import { RowsData, usePaginatedQuery } from "./helpers/usePaginatedQuery";
import { Product, useGetProducts } from "./useProducts";

interface options {
  itemsPerPage: number;
  productClicked?: (product?: Product, action?: string) => void;
  onShelfOnly?: boolean;
}

interface Dataset {
  [key: string]: string;
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
  return usePaginatedQuery({
    itemsPerPage,
    paginatedQuery: useGetProducts(onShelfOnly),
    mapData,
    dataClicked: productClicked,
  });
};
