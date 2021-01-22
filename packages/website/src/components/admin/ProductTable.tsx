import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Product as ProductData } from "hooks/useProducts";
import React from "react";
import ProductRow from "./ProductRow";

interface Props {
  productIds: number[];
  useGetProduct: (param: number) => ProductData | undefined;
  itemClickHandler: (id: number) => void;
}

const ProductTable = ({
  productIds,
  useGetProduct,
  itemClickHandler,
}: Props) => {
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
              useGetProduct,
              itemClickHandler,
            }}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default React.memo(ProductTable);
