import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback } from "react";
import { useGetProduct } from "store/selectors/product";

const useStyles = makeStyles(() => ({
  tableRow: {
    cursor: "pointer",
  },
}));

interface Props {
  id: number;
  itemClickHandler: (id: number) => void;
}

const ProductRow = ({ id, itemClickHandler }: Props) => {
  const classes = useStyles();
  const product = useGetProduct(id);
  const rowClickHandler = useCallback(() => {
    itemClickHandler(id);
  }, [itemClickHandler, id]);
  if (product === undefined) return null;
  return (
    <TableRow
      key={id}
      hover={true}
      className={classes.tableRow}
      onClick={rowClickHandler}
    >
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.isUp.toString()}</TableCell>
      <TableCell align="right">{product.quantity}</TableCell>
      <TableCell align="right">{`$ ${product.price.toFixed(2)}`}</TableCell>
    </TableRow>
  );
};

export default React.memo(ProductRow);
