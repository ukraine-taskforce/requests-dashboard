import { Box, Grid, Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";
import { useFilter } from "../contexts/filter";

const dateDisplayFormat = "DD.MM";
const inputDateFormat = "YYYY-MM-DD";
export interface TimelineSliderProps {
  // Timeline slider assums that dates are sorted and distinct,
  // passed as a strings in format DD-MM-YYYY.
  dates: string[];
}
export const TimelineSlider = ({ dates }: TimelineSliderProps) => {
  const [endDate, setEndDate] = useState<moment.Moment>(moment());
  const [startDate, setStartDate] = useState<moment.Moment>(moment());
  const [selectedDate, setDate] = useState(endDate.toDate());
  const { toggleFilterItem } = useFilter();

  useEffect(() => {
    if (dates.length) {
      setStartDate(moment(dates[0], inputDateFormat));
      setEndDate(moment(dates[dates.length - 1], inputDateFormat));
    }
  }, [dates]);

  if (dates.length <= 1) {
    return (
      <Box
        sx={{
          width: 350,
          m: 2,
          padding: 1,
          borderRadius: "20px",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <Typography sx={{ fontSize: 16, textAlign: "center" }}>No dates or one date provided.</Typography>
      </Box>
    );
  } else {
    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
      if (typeof newValue === "number") {
        const newDate = dates[newValue - 1];

        setDate(moment(newDate, inputDateFormat).toDate());
        toggleFilterItem("Dates", newDate);
      }
    };

    const rangeLabel = `${startDate.format(dateDisplayFormat)} - ${endDate.format(dateDisplayFormat)}`;

    return (
      <Box
        sx={{
          width: 350,
          m: 2,
          padding: 1,
          borderRadius: "20px",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <Typography sx={{ fontSize: 16, marginLeft: 12 }}>{moment(selectedDate).format(dateDisplayFormat)}</Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs sx={{ marginLeft: 2 }}>
            <Slider
              aria-label="Timeline"
              defaultValue={dates.length}
              onChange={handleSliderChange}
              step={1}
              marks
              min={1}
              max={dates.length}
              valueLabelDisplay="off"
            />
          </Grid>
          <Grid item>
            <Typography sx={{ fontSize: 14, marginRight: 2 }}>{rangeLabel}</Typography>
          </Grid>
        </Grid>
      </Box>
    );
  }
};
