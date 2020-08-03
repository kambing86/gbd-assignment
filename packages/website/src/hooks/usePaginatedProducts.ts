import { GraphQLGetProductsQuery } from "graphql/types-and-hooks";
import { useCallback, useEffect, useMemo } from "react";
import { atomFamily, useRecoilCallback } from "recoil";
import { RowsData, usePaginatedQuery } from "./helpers/usePaginatedQuery";
import { Product, useGetProducts } from "./useProducts";

interface options {
  itemsPerPage: number;
  productClicked?: (product?: Product, action?: string) => void;
  onShelfOnly?: boolean;
}

const paginatedProductFamily = atomFamily<Product | undefined, number>({
  key: "paginatedProductFamily",
  default: undefined,
});

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
  const setProduct = useRecoilCallback(
    ({ snapshot, set }) => async (product: Product) => {
      const { id } = product;
      const recoilState = paginatedProductFamily(id);
      const prev = await snapshot.getPromise(recoilState);
      if (prev !== product) {
        set(recoilState, product);
      }
    },
    [],
  );
  useEffect(() => {
    if (rowsData === undefined) return;
    for (const product of rowsData.rows) {
      setProduct(product);
    }
  }, [rowsData, setProduct]);
  const checkDuplicate = JSON.stringify(rowsData?.rows.map((r) => r.id));
  const productIds = useMemo(() => {
    return rowsData?.rows.map((r) => r.id) || [];
  }, [checkDuplicate]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...result, productIds, paginatedProductFamily };
};
