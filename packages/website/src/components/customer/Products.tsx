import Grid from "@material-ui/core/Grid";
import React, { MouseEvent } from "react";
import { RecoilState } from "recoil";
import { Product as ProductData } from "../../hooks/useProducts";
import Product from "./Product";

interface Props {
  productIds?: number[];
  getProduct: (param: number) => RecoilState<ProductData | undefined>;
  itemClickHandler: (event: MouseEvent) => void;
  buttonAction: string;
  buttonText: string;
}

const Products: React.FC<Props> = ({
  productIds = [],
  getProduct,
  itemClickHandler,
  buttonAction,
  buttonText,
}) => {
  return (
    <Grid container spacing={2}>
      {productIds.map((id) => (
        <Product
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

export default React.memo(Products);
