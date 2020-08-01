import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useMemo } from "react";
import MainLayout from "../components/common/MainLayout";
import Products from "../components/customer/Products";
import { CUSTOMER, useAuth } from "../hooks/useAuth";
import { useSetCart } from "../hooks/useCart";
import {
  paginatedProductFamily,
  usePaginatedProducts,
} from "../hooks/usePaginatedProducts";
import { Product } from "../hooks/useProducts";

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

const Customer: React.FC = () => {
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
    rowsData,
    loading,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    pageClickHandler,
  } = usePaginatedProducts({
    itemsPerPage: ITEMS_PER_PAGE,
    productClicked,
    onShelfOnly: true,
  });
  const checkDuplicate = JSON.stringify(rowsData?.rows.map((r) => r.id));
  const productIds = useMemo(() => {
    return rowsData?.rows.map((r) => r.id) || [];
  }, [checkDuplicate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainLayout>
      <Container className={classes.cardGrid} maxWidth="md">
        <>
          {loading && productIds.length === 0 && (
            <div className={classes.loadingGrid}>
              <CircularProgress />
            </div>
          )}
          <Products
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
