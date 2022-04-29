import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import ProductRow from "./ProductRow";

interface Props {
  productIds: number[];
  itemClickHandler: (id: number) => void;
}

const ProductTable = ({ productIds, itemClickHandler }: Props) => {
  return (
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
        {productIds.map((id) => (
          <ProductRow
            key={id}
            {...{
              id,
              itemClickHandler,
            }}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default React.memo(ProductTable);
