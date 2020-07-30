import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { MouseEvent, useCallback } from "react";
import MainLayout from "../components/common/MainLayout";
import PlaceOrder from "../components/customer/PlaceOrder";
import Products from "../components/customer/Products";
import { useRefInSync } from "../hooks/helpers/useRefInSync";
import { CUSTOMER, useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  loadingGrid: {
    padding: theme.spacing(8),
    width: "100%",
    textAlign: "center",
  },
  itemGrid: {
    width: "100%",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardAction: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  cardMedia: {
    paddingTop: "100%",
    width: "100%",
  },
  cardContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    flexGrow: 1,
  },
}));

export default function Cart() {
  useAuth(CUSTOMER);
  const classes = useStyles();
  const { removeFromCart, cartProducts, loading } = useCart();
  const productsRef = useRefInSync(cartProducts);
  const itemClickHandler = useCallback(
    (event: MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dataset = event.currentTarget.dataset as Dataset;
      const id = Number(dataset.id);
      const action = dataset.action;
      const product = productsRef.current?.find((p) => p.id === id);
      if (product && action === "removeFromCart") {
        removeFromCart(product);
      }
    },
    [productsRef, removeFromCart],
  );

  return (
    <MainLayout>
      <Container className={classes.cardGrid} maxWidth="md">
        {!loading && <PlaceOrder />}
        {!loading && cartProducts.length === 0 && (
          <Typography variant="h5" align="center">
            Your cart is empty
          </Typography>
        )}
        <Products
          {...{
            loading,
            products: cartProducts,
            itemClickHandler,
            buttonAction: "removeFromCart",
            buttonText: "Remove from Cart",
          }}
        />
        {!loading && cartProducts.length > 4 && <PlaceOrder />}
      </Container>
    </MainLayout>
  );
}
