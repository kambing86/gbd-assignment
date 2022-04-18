import Grid from "@material-ui/core/Grid";
import React from "react";
import { useGetCartProduct } from "store/selectors/cart";
import { useGetProduct } from "store/selectors/product";
import ProductItem from "./ProductItem";

export enum PRODUCT_TYPE {
  CATALOG = "CATALOG",
  CART = "CART",
}

interface Props {
  type: PRODUCT_TYPE;
  productIds: number[];
  itemClickHandler: (id: number, action: string) => void;
  buttonAction: string;
  buttonText: string;
}

const ProductGrid = ({
  type,
  productIds,
  itemClickHandler,
  buttonAction,
  buttonText,
}: Props) => {
  return (
    <Grid container spacing={2}>
      {productIds.map((id) => (
        <ProductItem
          key={id}
          {...{
            id,
            useGetProduct:
              type === PRODUCT_TYPE.CART ? useGetCartProduct : useGetProduct,
            itemClickHandler,
            buttonAction,
            buttonText,
          }}
        />
      ))}
    </Grid>
  );
};

export default React.memo(ProductGrid);
