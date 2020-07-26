import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Product, useProducts } from "../../hooks/useProducts";
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

const ITEM_PER_PAGE = 10;

const ProductList: React.FC = () => {
  const classes = useStyles();
  const [productsResult, getProducts] = useProducts();
  const [page, setPage] = useState(1);
  useEffect(() => {
    getProducts(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE);
  }, [getProducts, page]);
  const { loading, data } = productsResult;
  const enableNextPage = Boolean(
    !loading && data && data.products.total > page * data.products.limit,
  );
  const productsRef = useRef<Product[] | undefined>(data?.products.rows);
  productsRef.current = data?.products.rows;
  const rowClickHandler = useCallback(
    (event) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const id = Number(event.currentTarget.dataset.id);
      const product = productsRef.current?.find((p) => p.id === id);
      setEditProduct(product);
    },
    [productsRef],
  );
  const pageHandler = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (event.currentTarget.dataset.action === "next") {
        setPage((p) => p + 1);
      } else {
        setPage((p) => p - 1);
      }
    },
    [setPage],
  );
  const [editProduct, setEditProduct] = useState<Product>();
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
                onClick={rowClickHandler}
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
          onClick={pageHandler}
          disabled={page === 1}
          data-action="prev"
        >
          Prev
        </Button>
        <Button
          color="primary"
          href="#"
          onClick={pageHandler}
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
