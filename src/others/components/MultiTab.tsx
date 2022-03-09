import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface MultiTabProps {
  labels: string[];
}

export const MultiTab = ({ labels }: MultiTabProps) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs value={value} onChange={handleChange} centered>
        {labels.map((label) => (
          <Tab label={label} />
        ))}
      </Tabs>
    </Box>
  );
};
