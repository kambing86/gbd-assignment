import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MainLayout from "components/common/MainLayout";
import PlaceOrder from "components/customer/PlaceOrder";
import ProductGrid from "components/customer/ProductGrid";
import { CUSTOMER, useAuth } from "hooks/useAuth";
import { useGetCart } from "hooks/useCart";
import React, { useCallback } from "react";
import { cartActions } from "store/actions/cart";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  loadingGrid: {
    textAlign: "center",
  },
}));

export default function Cart() {
  useAuth(CUSTOMER);
  const classes = useStyles();
  const { productIds, isReady, useGetProduct } = useGetCart();
  const itemClickHandler = useCallback((id: number, action: string) => {
    if (action === "removeFromCart") {
      cartActions.removeFromCart(id);
    }
  }, []);

  return (
    <MainLayout>
      <Container className={classes.cardGrid} maxWidth="md">
        <>
          {!isReady && (
            <div className={classes.loadingGrid}>
              <CircularProgress />
            </div>
          )}
          {isReady && productIds.length === 0 && (
            <Typography variant="h5" align="center">
              Your cart is empty
            </Typography>
          )}
          {isReady && productIds.length !== 0 && <PlaceOrder />}
          {isReady && (
            <ProductGrid
              {...{
                productIds,
                useGetProduct,
                itemClickHandler,
                buttonAction: "removeFromCart",
                buttonText: "Remove from Cart",
              }}
            />
          )}
          {isReady && productIds.length > 4 && <PlaceOrder />}
        </>
      </Container>
    </MainLayout>
  );
}
