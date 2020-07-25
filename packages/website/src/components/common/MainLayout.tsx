import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import TopSideBar from "./TopSideBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
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

const MainLayout: React.FC<{ title: string }> = ({ title, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TopSideBar title={title} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
