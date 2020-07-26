import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import {
  totalAmountCount,
  totalCartCount,
  useCart,
  useCartWithProduct,
} from "../../hooks/useCart";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const PlaceOrder: React.FC = () => {
  const classes = useStyles();
  const { cart } = useCart();
  const { cartProducts } = useCartWithProduct();
  return (
    <Grid container className={classes.grid}>
      <div>
        <Typography>
          Total amount: $ {totalAmountCount(cartProducts).toFixed(2)}
        </Typography>
        <Typography>Total items: {totalCartCount(cart)}</Typography>
      </div>
      <Button variant="contained" color="primary">
        Place Order
      </Button>
    </Grid>
  );
};

export default PlaceOrder;
