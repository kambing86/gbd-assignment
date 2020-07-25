import { Grid, Typography } from "@material-ui/core";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <Grid
      container
      alignContent="center"
      justify="center"
      style={{ height: "100vh" }}
    >
      <Typography variant="h3">Loading...</Typography>
    </Grid>
  );
};

export default NotFound;
