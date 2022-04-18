import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import OrderItem from "./OrderItem";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

interface Props {
  orderIds: number[];
  itemClickHandler: (id: number) => void;
}

const OrderList = ({ orderIds, itemClickHandler }: Props) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {orderIds.map((id) => (
        <OrderItem
          key={id}
          {...{
            id,
            itemClickHandler,
          }}
        />
      ))}
    </List>
  );
};

export default React.memo(OrderList);
