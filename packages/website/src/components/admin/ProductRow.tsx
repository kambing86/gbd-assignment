import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import { Product as ProductData } from "hooks/useProducts";
import React, { MouseEvent } from "react";
import { RecoilState, useRecoilValue } from "recoil";

const useStyles = makeStyles((theme) => ({
  tableRow: {
    cursor: "pointer",
  },
}));

interface Props {
  id: number;
  getProduct: (param: number) => RecoilState<ProductData | undefined>;
  itemClickHandler: (event: MouseEvent) => void;
}

const ProductRow: React.FC<Props> = ({ id, getProduct, itemClickHandler }) => {
  const classes = useStyles();
  const product = useRecoilValue(getProduct(id));
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
