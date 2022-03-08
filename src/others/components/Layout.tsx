import React from "react";

import styles from "./Layout.module.css";

export interface LayoutProps {}

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}> Sidebar</div>
      <div>
        <nav>Header bar</nav>
        <div>{children}</div>
      </div>
    </div>
  );
};
