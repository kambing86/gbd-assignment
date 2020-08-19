import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import { Product as ProductData } from "hooks/useProducts";
import React, { MouseEvent } from "react";

const useStyles = makeStyles(() => ({
  tableRow: {
    cursor: "pointer",
  },
}));

interface Props {
  id: number;
  useGetProduct: (param: number) => ProductData | undefined;
  itemClickHandler: (event: MouseEvent) => void;
}

const ProductRow = ({
  id,
  useGetProduct,
  itemClickHandler,
}: Props): JSX.Element | null => {
  const classes = useStyles();
  const product = useGetProduct(id);
  if (product === undefined) return null;
  return (
    <TableRow
      key={id}
      hover={true}
      className={classes.tableRow}
      data-id={id}
      onClick={itemClickHandler}
    >
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.isUp.toString()}</TableCell>
      <TableCell align="right">{product.quantity}</TableCell>
      <TableCell align="right">{`$ ${product.price.toFixed(2)}`}</TableCell>
    </TableRow>
  );
};

export default React.memo(ProductRow);
