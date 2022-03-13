import * as React from "react";
import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface MultiTabProps extends Omit<BoxProps, "onChange"> {
  labels: string[];
  selectedId: number;
  onChange: (tabId: number) => void;
}

// TODO: This one still needs styling
export const MultiTab = ({ labels, selectedId, onChange, ...wrapperStyles }: MultiTabProps) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ width: "100%", ...wrapperStyles }}>
      <StyledTabs value={selectedId} onChange={handleChange} aria-label="styled tabs example">
        {labels.map((label) => (
          <StyledTab label={label} key={label} />
        ))}
      </StyledTabs>
    </Box>
  );
};

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#635ee7",
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: "none",

  color: "rgba(255, 255, 255, 0.7)",

  "&.Mui-selected": {
    color: "#fff",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));
