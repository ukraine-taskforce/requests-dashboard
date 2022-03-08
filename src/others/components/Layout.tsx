import { ReactNode } from "react";
import Stack from "@mui/material/Stack";

export interface LayoutProps {
  header?: ReactNode;
}

export const Layout: React.FunctionComponent<LayoutProps> = ({ header, children }) => {
  return (
    <Stack>
      {header}
      <div>{children}</div>
    </Stack>
  );
};
