import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Product, useGetProducts } from "./useProducts";

interface options {
  itemsPerPage: number;
  productClicked?: (product?: Product, action?: string) => void;
  onShelfOnly?: boolean;
}

interface Dataset {
  [key: string]: string;
}

// How to use:
// onShelfOnly is for initialize only
// itemClickHandler is binded to item with data-id={id}
// pageHandler is binded to button with data-action="prev"|"next"
export const usePaginatedProducts = ({
  itemsPerPage,
  productClicked,
  onShelfOnly,
}: options) => {
  const [productsResult, getProducts] = useGetProducts(onShelfOnly);
  const [page, setPage] = useState(1);
  useEffect(() => {
    getProducts(itemsPerPage * (page - 1), itemsPerPage);
  }, [getProducts, page, itemsPerPage]);
  const { loading, data } = productsResult;
  const enablePrevPage = page !== 1;
  const enableNextPage = Boolean(
    !loading && data && data.products.total > page * data.products.limit,
  );
  const productsRef = useRef<Product[] | undefined>(data?.products.rows);
  productsRef.current = data?.products.rows;
  const itemClickHandler = useCallback(
    (event: MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dataset = event.currentTarget.dataset as Dataset;
      const id = Number(dataset.id);
      const action = dataset.action;
      const product = productsRef.current?.find((p) => p.id === id);
      productClicked?.(product, action);
    },
    [productsRef, productClicked],
  );
  const pageClickHandler = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (event.currentTarget.dataset.action === "next") {
        setPage((p) => p + 1);
      } else {
        setPage((p) => p - 1);
      }
    },
    [setPage],
  );
  return {
    productsResult,
    page,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    pageClickHandler,
  };
};
