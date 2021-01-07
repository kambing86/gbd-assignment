import Grid from "@material-ui/core/Grid";
import { Product as ProductData } from "hooks/useProducts";
import React from "react";
import ProductItem from "./ProductItem";

interface Props {
  productIds: number[];
  useGetProduct: (param: number) => ProductData | undefined;
  itemClickHandler: (id: number, action: string) => void;
  buttonAction: string;
  buttonText: string;
}

const ProductGrid = ({
  productIds,
  useGetProduct,
  itemClickHandler,
  buttonAction,
  buttonText,
}: Props): JSX.Element => {
  return (
    <Grid container spacing={2}>
      {productIds.map((id) => (
        <ProductItem
          key={id}
          {...{
            id,
            useGetProduct,
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
