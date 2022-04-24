import { Grid, Typography } from "@material-ui/core";
import React from "react";

const NotFound = () => {
  return (
    <Grid
      container
      alignContent="center"
      justifyContent="center"
      style={{ height: "100vh" }}
    >
      <Typography variant="h3">Page Not Found</Typography>
    </Grid>
  );
};

export default React.memo(NotFound);
