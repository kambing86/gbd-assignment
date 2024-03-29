import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { useRefInSync } from "hooks/helpers/useRefInSync";
import { useRoute } from "hooks/helpers/useRoute";
import { totalAmountCount, totalCartCount, useGetCart } from "hooks/useCart";
import { useCreateOrder } from "hooks/useOrder";
import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "store/slices/cart.slice";

const useStyles = makeStyles<Theme>((theme) => ({
  grid: {
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const PlaceOrder = () => {
  const classes = useStyles();
  const { cart, cartProducts, isReady } = useGetCart();
  const cartRef = useRefInSync(cart);
  const { result, createOrder } = useCreateOrder();
  const placeOrderHandler = useCallback(() => {
    void createOrder(cartRef.current);
  }, [createOrder, cartRef]);
  const { pushHistory } = useRoute();
  const { loading, data } = result;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loading) {
      if (data) {
        dispatch(cartActions.clearCart());
        pushHistory("/customer/order");
      }
    }
  }, [loading, data, dispatch, pushHistory]);
  return Object.keys(cart).length > 0 ? (
    <Grid container className={classes.grid}>
      <div>
        <Typography>
          Total amount: $ {totalAmountCount(cart, cartProducts).toFixed(2)}
        </Typography>
        <Typography>Total items: {totalCartCount(cart)}</Typography>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={placeOrderHandler}
        disabled={!isReady}
      >
        Place Order
      </Button>
    </Grid>
  ) : null;
};

export default React.memo(PlaceOrder);
