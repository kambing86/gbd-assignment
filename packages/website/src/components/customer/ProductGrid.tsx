import Grid from "@material-ui/core/Grid";
import { Product as ProductData } from "hooks/useProducts";
import React, { MouseEvent } from "react";
import { RecoilState } from "recoil";
import ProductItem from "./ProductItem";

interface Props {
  productIds: number[];
  getProduct: (param: number) => RecoilState<ProductData | undefined>;
  itemClickHandler: (event: MouseEvent) => void;
  buttonAction: string;
  buttonText: string;
}

const ProductGrid = ({
  productIds,
  getProduct,
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
            getProduct,
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
