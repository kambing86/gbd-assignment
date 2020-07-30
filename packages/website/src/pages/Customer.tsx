import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback } from "react";
import MainLayout from "../components/common/MainLayout";
import Products from "../components/customer/Products";
import { CUSTOMER, useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { usePaginatedProducts } from "../hooks/usePaginatedProducts";
import { Product } from "../hooks/useProducts";
import { useUser } from "../hooks/useUser";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

const ITEMS_PER_PAGE = 8;

const Customer: React.FC = () => {
  useAuth(CUSTOMER);
  const [user] = useUser();
  const classes = useStyles();
  const { addToCart } = useCart();
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

  return (
    <MainLayout title={`Hello ${user?.username}`}>
      <Container className={classes.cardGrid} maxWidth="md">
        <Products {...{ loading, rowsData, itemClickHandler }} />
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
      </Container>
    </MainLayout>
  );
};

export default React.memo(Customer);
