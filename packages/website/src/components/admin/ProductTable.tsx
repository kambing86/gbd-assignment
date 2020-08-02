import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { MouseEvent } from "react";
import { RecoilState } from "recoil";
import { Product as ProductData } from "../../hooks/useProducts";
import ProductRow from "./ProductRow";

interface Props {
  productIds: number[];
  getProduct: (param: number) => RecoilState<ProductData | undefined>;
  itemClickHandler: (event: MouseEvent) => void;
}

const ProductTable: React.FC<Props> = ({
  productIds,
  getProduct,
  itemClickHandler,
}) => {
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
              getProduct,
              itemClickHandler,
            }}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default React.memo(ProductTable);
