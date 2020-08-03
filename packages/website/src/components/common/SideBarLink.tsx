import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useRoute } from "hooks/helpers/useRoute";
import React, { useCallback } from "react";

const SideBarLink: React.FC<{
  path: string;
  text: string;
  icon: JSX.Element;
}> = ({ path, text, icon }) => {
  const { pushHistory, location } = useRoute();
  const clickHandler = useCallback(() => {
    pushHistory(path);
  }, [path, pushHistory]);
  return (
    <ListItem
      button
      onClick={clickHandler}
      selected={location.pathname === path ? true : false}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};

export default React.memo(SideBarLink);
