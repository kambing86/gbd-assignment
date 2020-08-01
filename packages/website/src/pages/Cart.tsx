import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { MouseEvent, useCallback, useMemo } from "react";
import MainLayout from "../components/common/MainLayout";
import PlaceOrder from "../components/customer/PlaceOrder";
import Products from "../components/customer/Products";
import { CUSTOMER, useAuth } from "../hooks/useAuth";
import {
  cartProductsFamily,
  useCartProductsState,
  useGetCart,
  useSetCart,
} from "../hooks/useCart";

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
  const { cart, loading } = useGetCart();
  const { removeFromCart } = useSetCart();
  const { getCartProduct } = useCartProductsState();
  // const productsRef = useRefInSync(cartProducts);
  const itemClickHandler = useCallback(
    async (event: MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dataset = event.currentTarget.dataset as Dataset;
      const id = Number(dataset.id);
      const action = dataset.action;
      const product = await getCartProduct(id);
      if (product && action === "removeFromCart") {
        removeFromCart(product);
      }
    },
    [getCartProduct, removeFromCart],
  );
  const checkDuplicate = JSON.stringify(Object.keys(cart));
  const productIds = useMemo(() => {
    return Object.keys(cart).map((id) => Number(id));
  }, [checkDuplicate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainLayout>
      <Container className={classes.cardGrid} maxWidth="md">
        {!loading && <PlaceOrder />}
        {!loading && productIds.length === 0 && (
          <Typography variant="h5" align="center">
            Your cart is empty
          </Typography>
        )}
        <Products
          {...{
            loading,
            productIds,
            getProduct: cartProductsFamily,
            itemClickHandler,
            buttonAction: "removeFromCart",
            buttonText: "Remove from Cart",
          }}
        />
        {!loading && productIds.length > 4 && <PlaceOrder />}
      </Container>
    </MainLayout>
  );
}
