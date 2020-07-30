import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React, { MouseEvent } from "react";
import { GraphQLProduct } from "../../graphql/types-and-hooks";
import Product from "./Product";

const useStyles = makeStyles((theme) => ({
  loadingGrid: {
    width: "100%",
    textAlign: "center",
  },
}));

interface Props {
  loading: boolean;
  products?: GraphQLProduct[];
  itemClickHandler: (event: MouseEvent) => void;
  buttonAction: string;
  buttonText: string;
}

const Products: React.FC<Props> = ({
  loading,
  products = [],
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
      {!loading &&
        products.map((product) => (
          <Product
            key={product.id}
            {...{
              product,
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
