import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import MainLayout from "components/common/MainLayout";
import ProductGrid from "components/customer/ProductGrid";
import { CUSTOMER, useAuth } from "hooks/useAuth";
import { useSetCart } from "hooks/useCart";
import { usePaginatedProducts } from "hooks/usePaginatedProducts";
import { Product } from "hooks/useProducts";
import React, { useCallback } from "react";

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

const Customer = (): JSX.Element => {
  useAuth(CUSTOMER);
  const classes = useStyles();
  const { addToCart } = useSetCart();
  const productClicked = useCallback(
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
    pageClickHandler,
    productIds,
    paginatedProductFamily,
  } = usePaginatedProducts({
    itemsPerPage: ITEMS_PER_PAGE,
    productClicked,
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
              getProduct: paginatedProductFamily,
              itemClickHandler,
              buttonAction: "addToCart",
              buttonText: "Add to Cart",
            }}
          />
          <Button
            color="primary"
            href="#"
            onClick={pageClickHandler}
            disabled={!enablePrevPage}
            data-action="prev"
          >
            Prev
          </Button>
          <Button
            color="primary"
            href="#"
            onClick={pageClickHandler}
            disabled={!enableNextPage}
            data-action="next"
          >
            Next
          </Button>
        </>
      </Container>
    </MainLayout>
  );
};

export default React.memo(Customer);
