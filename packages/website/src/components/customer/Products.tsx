import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React, { MouseEvent } from "react";
import { RecoilState } from "recoil";
import { Product as ProductData } from "../../hooks/useProducts";
import Product from "./Product";

const useStyles = makeStyles((theme) => ({
  loadingGrid: {
    width: "100%",
    textAlign: "center",
  },
}));

interface Props {
  loading: boolean;
  productIds?: number[];
  getProduct: (param: number) => RecoilState<ProductData | undefined>;
  itemClickHandler: (event: MouseEvent) => void;
  buttonAction: string;
  buttonText: string;
}

const Products: React.FC<Props> = ({
  loading,
  productIds = [],
  getProduct,
  itemClickHandler,
  buttonAction,
  buttonText,
}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      {loading && (
        <Grid item className={classes.loadingGrid}>
          <CircularProgress />
        </Grid>
      )}
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
