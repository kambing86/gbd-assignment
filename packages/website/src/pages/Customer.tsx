import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import ProductGrid, { PRODUCT_TYPE } from "components/customer/ProductGrid";
import { CUSTOMER, useAuth } from "hooks/useAuth";
import { useAddToCart } from "hooks/useCart";
import { usePaginatedProducts } from "hooks/usePaginatedProducts";
import { Product } from "hooks/useProducts";
import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { userThunkActions } from "store/slices/user.slice";

const useStyles = makeStyles<Theme>((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  loadingGrid: {
    textAlign: "center",
  },
}));

const ITEMS_PER_PAGE = 8;

const Customer = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    void dispatch(userThunkActions.getData(1));
  }, [dispatch]);
  useAuth(CUSTOMER);
  const classes = useStyles();
  const addToCart = useAddToCart();
  const dataClicked = useCallback(
    (product?: Product, action?: string) => {
      if (action === "addToCart" && product) {
        addToCart(product);
      }
    },
    [addToCart],
  );
  const {
    loading,
    hasData,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    prevPageHandler,
    nextPageHandler,
    productIds,
  } = usePaginatedProducts({
    itemsPerPage: ITEMS_PER_PAGE,
    dataClicked,
    onShelfOnly: true,
  });
  return (
    <Container className={classes.cardGrid} maxWidth="md">
      {loading && !hasData && (
        <div className={classes.loadingGrid}>
          <CircularProgress />
        </div>
      )}
      <ProductGrid
        {...{
          type: PRODUCT_TYPE.CATALOG,
          productIds,
          itemClickHandler,
          buttonAction: "addToCart",
          buttonText: "Add to Cart",
        }}
      />
      <Button
        color="primary"
        href="#"
        onClick={prevPageHandler}
        disabled={!enablePrevPage}
      >
        Prev
      </Button>
      <Button
        color="primary"
        href="#"
        onClick={nextPageHandler}
        disabled={!enableNextPage}
      >
        Next
      </Button>
    </Container>
  );
};

export default React.memo(Customer);
