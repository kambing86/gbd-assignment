import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import {
  Order,
  getLocalDate,
  getTotalAmount,
  useGetOrderDetails,
} from "hooks/useOrder";
import React from "react";

const useStyles = makeStyles<Theme>((theme) => ({
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

const OrderDetailDialog = ({ handleClose, order }: Props) => {
  const classes = useStyles();
  const { productDetails, loading } = useGetOrderDetails(order);
  return (
    <Dialog
      maxWidth={"md"}
      fullWidth={true}
      open={true}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
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
                  <CardActionArea className={classes.cardAction}>
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

export default React.memo(OrderDetailDialog);
