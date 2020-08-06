import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MainLayout from "components/common/MainLayout";
import PlaceOrder from "components/customer/PlaceOrder";
import ProductGrid from "components/customer/ProductGrid";
import { CUSTOMER, useAuth } from "hooks/useAuth";
import { useCartProductsState, useGetCart, useSetCart } from "hooks/useCart";
import React, { MouseEvent, useCallback, useMemo } from "react";

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
  const { cart, cartProducts, loading, cartProductsFamily } = useGetCart();
  const { removeFromCart } = useSetCart();
  const { getCartProductAsync } = useCartProductsState();
  const itemClickHandler = useCallback(
    async (event: MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dataset = event.currentTarget.dataset as Dataset;
      const id = Number(dataset.id);
      const action = dataset.action;
      const product = await getCartProductAsync(id);
      if (product && action === "removeFromCart") {
        removeFromCart(product);
      }
    },
    [getCartProductAsync, removeFromCart],
  );
  const checkDuplicate = JSON.stringify(Object.keys(cart));
  const productIds = useMemo(() => {
    return Object.keys(cart).map((id) => Number(id));
  }, [checkDuplicate]); // eslint-disable-line react-hooks/exhaustive-deps
  const isReady = useMemo(() => {
    const readyIds = Object.keys(cartProducts).map((id) => Number(id));
    for (const id of productIds) {
      if (!readyIds.includes(id)) return false;
    }
    return true;
  }, [cartProducts, productIds]);
  const isLoading = !isReady || loading;

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
          {isReady && productIds.length !== 0 && (
            <PlaceOrder isLoading={isLoading} />
          )}
          {isReady && (
            <ProductGrid
              {...{
                productIds,
                getProduct: cartProductsFamily,
                itemClickHandler,
                buttonAction: "removeFromCart",
                buttonText: "Remove from Cart",
              }}
            />
          )}
          {isReady && productIds.length > 4 && (
            <PlaceOrder isLoading={isLoading} />
          )}
        </>
      </Container>
    </MainLayout>
  );
}
