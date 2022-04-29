import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";
import OrderItem from "./OrderItem";

const useStyles = makeStyles<Theme>((theme) => ({
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
    <Paper elevation={2}>
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
    </Paper>
  );
};

export default React.memo(OrderList);
