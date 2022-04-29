import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { usePaginatedProducts } from "hooks/usePaginatedProducts";
import { Product } from "hooks/useProducts";
import React, { useCallback, useState } from "react";
import EditProductDialog from "./EditProductDialog";
import ProductTable from "./ProductTable";

const useStyles = makeStyles<Theme>((theme) => ({
  loading: {
    alignSelf: "center",
  },
  seeMore: {
    textAlign: "right",
    marginTop: theme.spacing(3),
  },
}));

const ITEMS_PER_PAGE = 10;

const ProductList = () => {
  const classes = useStyles();
  const [editProduct, setEditProduct] = useState<Product>();
  const {
    loading,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    prevPageHandler,
    nextPageHandler,
    productIds,
  } = usePaginatedProducts({
    itemsPerPage: ITEMS_PER_PAGE,
    dataClicked: setEditProduct,
  });
  const closeDialogHandler = useCallback(() => {
    setEditProduct(undefined);
  }, []);
  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Products
      </Typography>
      {loading && <CircularProgress className={classes.loading} />}
      <ProductTable
        {...{
          productIds,
          itemClickHandler,
        }}
      />
      <div className={classes.seeMore}>
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
      </div>
      {editProduct !== undefined && (
        <EditProductDialog
          handleClose={closeDialogHandler}
          product={editProduct}
        />
      )}
    </>
  );
};

export default React.memo(ProductList);
