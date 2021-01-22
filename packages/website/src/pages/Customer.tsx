import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import MainLayout from "components/common/MainLayout";
import ProductGrid from "components/customer/ProductGrid";
import { CUSTOMER, useAuth } from "hooks/useAuth";
import { useAddToCart } from "hooks/useCart";
import { usePaginatedProducts } from "hooks/usePaginatedProducts";
import { Product } from "hooks/useProducts";
import React, { useCallback, useEffect } from "react";
import { userThunkActions } from "store/actions/user";

const useStyles = makeStyles((theme) => ({
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
  useEffect(() => {
    void userThunkActions.getData(1);
  }, []);
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
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    prevPageHandler,
    nextPageHandler,
    productIds,
    useGetProduct,
  } = usePaginatedProducts({
    itemsPerPage: ITEMS_PER_PAGE,
    dataClicked,
    onShelfOnly: true,
  });
  return (
    <MainLayout>
      <Container className={classes.cardGrid} maxWidth="md">
        <>
          {loading && productIds.length === 0 && (
            <div className={classes.loadingGrid}>
              <CircularProgress />
            </div>
          )}
          <ProductGrid
            {...{
              productIds,
              useGetProduct,
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
        </>
      </Container>
    </MainLayout>
  );
};

export default React.memo(Customer);
