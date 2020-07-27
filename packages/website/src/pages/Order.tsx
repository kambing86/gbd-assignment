import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useMemo } from "react";
import MainLayout from "../components/common/MainLayout";
import { CUSTOMER, useAuth } from "../hooks/useAuth";
import { Order as OrderStructure, getTotalAmount } from "../hooks/useOrder";
import { usePaginatedOrders } from "../hooks/usePaginatedOrders";
import { useUser } from "../hooks/useUser";

const useStyles = makeStyles((theme) => ({
  loading: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  seeMore: {
    textAlign: "right",
    marginTop: theme.spacing(3),
  },
}));

const ITEMS_PER_PAGE = 10;

const Order: React.FC = () => {
  useAuth(CUSTOMER);
  const dataClicked = useCallback((order?: OrderStructure) => {
    // console.log(order);
  }, []);
  const {
    rowsData,
    loading,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    pageClickHandler,
  } = usePaginatedOrders(ITEMS_PER_PAGE, dataClicked);
  const [user] = useUser();
  const classes = useStyles();
  const title = useMemo(() => `Hello ${user?.username}`, [user]);
  // console.log({ rowsData });

  return (
    <MainLayout title={title}>
      {loading && (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
      {!loading && rowsData && (
        <List className={classes.root}>
          {rowsData.rows.map((r) => (
            <ListItem
              key={r.id}
              button
              alignItems="flex-start"
              data-id={r.id}
              onClick={itemClickHandler}
            >
              <ListItemText
                primary={
                  <>
                    <Typography
                      component="span"
                      variant="h6"
                      color="textPrimary"
                    >
                      Order created:
                    </Typography>
                    {` ${r.createdDate}`}
                  </>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Total cmount:
                    </Typography>
                    {` $ ${getTotalAmount(r).toFixed(2)}`}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
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
    </MainLayout>
  );
};

export default Order;
