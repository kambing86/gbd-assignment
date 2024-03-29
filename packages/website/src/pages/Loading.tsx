import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";

const Loading = () => {
  return (
    <Grid
      container
      alignContent="center"
      justifyContent="center"
      style={{ height: "100vh" }}
    >
      <Typography variant="h3">Loading...</Typography>
    </Grid>
  );
};

export default React.memo(Loading);
