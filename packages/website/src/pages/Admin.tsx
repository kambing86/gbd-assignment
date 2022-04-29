import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import ProductList from "components/admin/ProductList";
import { ADMIN, useAuth } from "hooks/useAuth";
import React from "react";

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

function Admin() {
  useAuth(ADMIN);
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ProductList />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default React.memo(Admin);
