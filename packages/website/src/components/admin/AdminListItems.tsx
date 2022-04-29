import SideBarLink from "components/common/SideBarLink";
import React from "react";

const AdminListItems = () => (
  <>
    <SideBarLink path="/admin" text="Products" icon="view_list" />
  </>
);

export default React.memo(AdminListItems);
