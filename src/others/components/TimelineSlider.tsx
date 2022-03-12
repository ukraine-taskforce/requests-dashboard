import { Box, Grid, Slider, Typography } from "@mui/material";
import React from "react";
import moment from "moment";

const dateDisplayFormat = 'DD.MM'
const inputDateFormat = 'DD-MM-YYYY'
export interface TimelineSliderProps {
    // Timeline slider assums that dates are sorted and distinct,
    // passed as a strings in format DD-MM-YYYY.
    possibleDates: string[]
}
export const TimelineSlider = ({ possibleDates }: TimelineSliderProps) => {
    const endDate = moment(possibleDates[possibleDates.length - 1], inputDateFormat)
    const startDate = moment(possibleDates[0], inputDateFormat)

    const [selectedDateValue, setValue] = React.useState(endDate)
    const rangeLabel =
        `${startDate.format(dateDisplayFormat)} - ${endDate.format(dateDisplayFormat)}`

    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setValue(moment(possibleDates[newValue - 1], inputDateFormat))
        }
    }

    return (
        <Box sx={{
            width: 350, m: 2, padding: 1, borderRadius: "20px",
            backgroundColor: "#000",
            color: "#fff"
        }}>
            <Typography sx={{ fontSize: 16, marginLeft: 12 }}>
                {selectedDateValue.format(dateDisplayFormat)}
            </Typography>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs sx={{ marginLeft: 2 }}>
                    <Slider
                        aria-label="Timeline"
                        defaultValue={possibleDates.length}
                        onChange={handleSliderChange}
                        step={1}
                        marks
                        min={1}
                        max={possibleDates.length}
                        valueLabelDisplay="off"
                    />
                </Grid>
                <Grid item>
                    <Typography sx={{ fontSize: 14, marginRight: 2 }}>
                        {rangeLabel}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}
