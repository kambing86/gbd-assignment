import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useRefInSync } from "hooks/helpers/useRefInSync";
import { useRoute } from "hooks/helpers/useRoute";
import {
  totalAmountCount,
  totalCartCount,
  useGetCart,
  useSetCart,
} from "hooks/useCart";
import { useCreateOrder } from "hooks/useOrder";
import React, { useCallback, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

interface Props {
  isLoading: boolean;
}

const PlaceOrder = ({ isLoading }: Props): JSX.Element | null => {
  const classes = useStyles();
  const { cart, cartProducts } = useGetCart();
  const cartRef = useRefInSync(cart);
  const { clearCart } = useSetCart();
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
        disabled={isLoading}
      >
        Place Order
      </Button>
    </Grid>
  ) : null;
};

export default React.memo(PlaceOrder);
