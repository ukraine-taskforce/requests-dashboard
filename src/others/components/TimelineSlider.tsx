import { useTranslation } from "react-i18next";
import { Box, Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";
import { useFilter } from "../contexts/filter";

const dateDisplayFormat = "DD.MM";
const inputDateFormat = "YYYY-MM-DD";

export interface TimelineSliderProps {
  // Timeline slider assumes that dates are sorted and distinct,
  // passed as a strings in format DD-MM-YYYY.
  dates: string[];
}
export const TimelineSlider = ({ dates }: TimelineSliderProps) => {
  const { t } = useTranslation();
  const [endDate, setEndDate] = useState<moment.Moment>(moment());
  const [startDate, setStartDate] = useState<moment.Moment>(moment());
  const { toggleFilterItem, getActiveFilterItems } = useFilter();

  const selectedDate = getActiveFilterItems('Dates')[0]; // There can only be one date selected
  const selectedDateIndex = dates.indexOf(selectedDate as string);

  useEffect(() => {
    const endDate = moment(dates[dates.length - 1], inputDateFormat);
    if (dates.length) {
      setStartDate(moment(dates[0], inputDateFormat));
      setEndDate(endDate);
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
          backgroundColor: "#fff",
          color: "#000",
        }}
      >
        <Typography sx={{ fontSize: 16, textAlign: "center" }}>{t("no_dates")}</Typography>
      </Box>
    );
  } else {
    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
      if (typeof newValue === "number") {
        const newDate = dates[newValue - 1];
        toggleFilterItem("Dates", newDate);
      }
    };

    const rangeLabel = `${startDate.format(dateDisplayFormat)} - ${endDate.format(dateDisplayFormat)}`;

    return (
      <Box
        sx={{
          paddingX: 6,
          height: "40px",
          borderRadius: "20px",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Typography variant="body2" noWrap>
          {t("dates_range")}: {rangeLabel}
        </Typography>

        <Slider
          aria-label="Timeline"
          value={selectedDateIndex + 1}
          onChange={handleSliderChange}
          track={false}
          step={1}
          marks
          min={1}
          max={dates.length}
          valueLabelDisplay="off"
          sx={{
            width: "240px",
          }}
        />

        {selectedDate && (
          <Typography variant="body2" sx={{ fontWeight: 600, width: "40px" }} align="right">
            {moment(selectedDate).format(dateDisplayFormat)}
          </Typography>
        )}
      </Box>
    );
  }
};
