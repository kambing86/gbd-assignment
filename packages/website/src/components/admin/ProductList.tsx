import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { usePaginatedProducts } from "hooks/usePaginatedProducts";
import { Product } from "hooks/useProducts";
import React, { useCallback, useState } from "react";
import EditProductDialog from "./EditProductDialog";
import ProductTable from "./ProductTable";

const useStyles = makeStyles((theme) => ({
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
