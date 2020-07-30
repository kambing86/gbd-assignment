import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { MouseEvent } from "react";
import { GraphQLProduct } from "../../graphql/types-and-hooks";

const useStyles = makeStyles((theme) => ({
  loadingGrid: {
    width: "100%",
    textAlign: "center",
  },
  itemGrid: {
    width: "100%",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
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
  loading: boolean;
  products?: GraphQLProduct[];
  itemClickHandler: (event: MouseEvent) => void;
  buttonAction: string;
  buttonText: string;
}

const Products: React.FC<Props> = ({
  loading,
  products = [],
  itemClickHandler,
  buttonAction,
  buttonText,
}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      {loading && (
        <Grid item className={classes.loadingGrid}>
          <CircularProgress />
        </Grid>
      )}
      {!loading &&
        products.map((product) => (
          <Grid
            item
            className={classes.itemGrid}
            key={product.id}
            sm={6}
            md={4}
            lg={3}
          >
            <Card className={classes.card}>
              <CardActionArea
                className={classes.cardAction}
                data-id={product.id}
                onClick={itemClickHandler}
              >
                <CardMedia
                  className={classes.cardMedia}
                  image={product.image ?? "https://source.unsplash.com/random"}
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
                  <Typography>Quantity: {product.quantity}</Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  data-id={product.id}
                  data-action={buttonAction}
                  onClick={itemClickHandler}
                >
                  {buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export default React.memo(Products);
