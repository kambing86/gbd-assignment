import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import LightThemeIcon from "@material-ui/icons/Brightness4";
import DarkThemeIcon from "@material-ui/icons/Brightness7";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import AdminListItems from "components/admin/AdminListItems";
import CartIcon from "components/customer/CartIcon";
import CustomerListItems from "components/customer/CustomerListItems";
import { useAppTheme } from "hooks/useAppTheme";
import { useDrawer } from "hooks/useDrawer";
import { useLogout } from "hooks/useLogout";
import { useGetUser } from "hooks/useUser";
import React, { useCallback } from "react";

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
}));

const TopSideBar = (): JSX.Element => {
  const classes = useStyles();
  const [open, setOpen] = useDrawer();
  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const handleDrawerClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  const { theme, toggleDarkMode } = useAppTheme();
  const { logout } = useLogout();
  const user = useGetUser();
  const isAdmin = Boolean(user?.isAdmin);
  const isCustomer = Boolean(user && !user.isAdmin);
  return (
    <>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden,
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {`Hello ${user?.username}`}
          </Typography>
          {isCustomer && <CartIcon />}
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {theme.palette.type === "light" ? (
              <LightThemeIcon />
            ) : (
              <DarkThemeIcon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {isAdmin && <AdminListItems />}
          {isCustomer && <CustomerListItems />}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default React.memo(TopSideBar);
