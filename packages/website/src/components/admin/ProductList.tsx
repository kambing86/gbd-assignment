import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useState } from "react";
import { usePaginatedProducts } from "../../hooks/usePaginatedProducts";
import { Product } from "../../hooks/useProducts";
import EditProductDialog from "./EditProductDialog";

const useStyles = makeStyles((theme) => ({
  loading: {
    alignSelf: "center",
  },
  tableRow: {
    cursor: "pointer",
  },
  seeMore: {
    textAlign: "right",
    marginTop: theme.spacing(3),
  },
}));

const ITEMS_PER_PAGE = 10;

const ProductList: React.FC = () => {
  const classes = useStyles();
  const [editProduct, setEditProduct] = useState<Product>();
  const {
    productsResult,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    pageClickHandler,
  } = usePaginatedProducts({
    itemsPerPage: ITEMS_PER_PAGE,
    productClicked: setEditProduct,
  });
  const { loading, data } = productsResult;
  const closeEditHandler = useCallback(() => {
    setEditProduct(undefined);
  }, []);
  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Products
      </Typography>
      {loading && <CircularProgress className={classes.loading} />}
      {!loading && data && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>On Shelf</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.products.rows.map((row) => (
              <TableRow
                key={row.id}
                hover={true}
                className={classes.tableRow}
                data-id={row.id}
                onClick={itemClickHandler}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.isUp.toString()}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{`$ ${row.price.toFixed(
                  2,
                )}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className={classes.seeMore}>
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
      </div>
      {editProduct !== undefined && (
        <EditProductDialog
          open={true}
          handleClose={closeEditHandler}
          product={editProduct}
        />
      )}
    </>
  );
};

export default ProductList;