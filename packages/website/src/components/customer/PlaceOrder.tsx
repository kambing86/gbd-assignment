import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useEffect } from "react";
import { useRefInSync } from "../../hooks/helpers/useRefInSync";
import { useRoute } from "../../hooks/helpers/useRoute";
import {
  totalAmountCount,
  totalCartCount,
  useGetCart,
  useSetCart,
} from "../../hooks/useCart";
import { useCreateOrder } from "../../hooks/useOrder";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const PlaceOrder: React.FC = () => {
  const classes = useStyles();
  const { cart, cartProducts } = useGetCart();
  const { clearCart } = useSetCart();
  const cartRef = useRefInSync(cart);
  const [result, createOrder] = useCreateOrder();
  const placeOrderHandler = useCallback(() => {
    createOrder(cartRef.current);
  }, [createOrder, cartRef]);
  const { pushHistory } = useRoute();
  const { loading, data } = result;
  useEffect(() => {
    if (!loading) {
      if (data) {
        clearCart();
        pushHistory("/customer/order");
      }
    }
  }, [loading, data, clearCart, pushHistory]);
  return cartProducts.length > 0 ? (
    <Grid container className={classes.grid}>
      <div>
        <Typography>
          Total amount: $ {totalAmountCount(cart, cartProducts).toFixed(2)}
        </Typography>
        <Typography>Total items: {totalCartCount(cart)}</Typography>
      </div>
      <Button variant="contained" color="primary" onClick={placeOrderHandler}>
        Place Order
      </Button>
    </Grid>
  ) : null;
};

export default React.memo(PlaceOrder);
