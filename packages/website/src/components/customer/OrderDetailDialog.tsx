import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  Order,
  getLocalDate,
  getTotalAmount,
  useGetOrderDetails,
} from "hooks/useOrder";
import React from "react";

const useStyles = makeStyles((theme) => ({
  loading: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
  itemGrid: {
    width: "100%",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#000",
  },
  cardAction: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  cardMedia: {
    paddingTop: "100%",
    width: "100%",
  },
  cardContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    flexGrow: 1,
  },
}));

interface Props {
  handleClose: () => void;
  order: Order;
}

const OrderDetailDialog: React.FC<Props> = ({ handleClose, order }) => {
  const classes = useStyles();
  const { productDetails, loading } = useGetOrderDetails(order);
  return (
    <Dialog
      maxWidth={"md"}
      fullWidth={true}
      open={true}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      disableBackdropClick={true}
    >
      <DialogTitle id="responsive-dialog-title">
        Order ID: {order.id}
      </DialogTitle>
      <DialogContent>
        <Typography>Date: {getLocalDate(order.createdDate)}</Typography>
        <Typography>
          Total Amount: $ {getTotalAmount(order).toFixed(2)}
        </Typography>
        {loading && (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        )}
        {!loading && productDetails !== undefined && (
          <Grid container spacing={2}>
            {productDetails.map((product) => (
              <Grid
                item
                className={classes.itemGrid}
                key={product.id}
                xs={6}
                sm={3}
              >
                <Card className={classes.card}>
                  <CardActionArea
                    className={classes.cardAction}
                    data-id={product.id}
                  >
                    <CardMedia
                      className={classes.cardMedia}
                      image={
                        product.image ?? "https://source.unsplash.com/random"
                      }
                      title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        className={classes.productName}
                      >
                        {product.name}
                      </Typography>
                      <Typography gutterBottom variant="h6" component="h3">
                        {`$ ${product.price.toFixed(2)}`}
                      </Typography>
                      <Typography>Bought: {product.quantity}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          autoFocus
          onClick={handleClose}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;
