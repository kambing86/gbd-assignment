import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import PlaceOrder from "components/customer/PlaceOrder";
import ProductGrid, { PRODUCT_TYPE } from "components/customer/ProductGrid";
import { CUSTOMER, useAuth } from "hooks/useAuth";
import { useGetCart } from "hooks/useCart";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "store/slices/cart.slice";

const useStyles = makeStyles<Theme>((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  loadingGrid: {
    textAlign: "center",
  },
}));

const Cart = () => {
  useAuth(CUSTOMER);
  const classes = useStyles();
  const { productIds, isReady } = useGetCart();
  const dispatch = useDispatch();
  const itemClickHandler = useCallback(
    (id: number, action: string) => {
      if (action === "removeFromCart") {
        dispatch(cartActions.removeFromCart(id));
      }
    },
    [dispatch],
  );

  return (
    <Container className={classes.cardGrid} maxWidth="md">
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
            type: PRODUCT_TYPE.CART,
            productIds,
            itemClickHandler,
            buttonAction: "removeFromCart",
            buttonText: "Remove from Cart",
          }}
        />
      )}
      {isReady && productIds.length > 4 && <PlaceOrder />}
    </Container>
  );
};

export default React.memo(Cart);
