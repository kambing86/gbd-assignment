import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Copyright from "./Copyright";
import TopSideBar from "./TopSideBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  contentWrapper: {
    flexGrow: 1,
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
  footer: {
    padding: theme.spacing(4),
  },
}));

const MainLayout: React.FC<{ title: string }> = ({ title, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TopSideBar title={title} />
      <main className={classes.content}>
        <div className={classes.contentWrapper}>
          <div className={classes.appBarSpacer} />
          {children}
        </div>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;
