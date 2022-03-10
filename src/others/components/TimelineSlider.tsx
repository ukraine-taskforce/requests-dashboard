import { Box, Grid, Slider, Typography } from "@mui/material";
import React from "react";
import moment from "moment";

const dateFormat = 'DD.MM'
export function TimelineSlider() {
    let todayDate = moment()
    let weekBeforeDate = moment().subtract(7, 'days')

    const [selectedDate, setValue] = React.useState<number | string | Array<number | string>>(
        '09.03',
      );

    const rangeLabel = `${weekBeforeDate.format(dateFormat)} - ${todayDate.format(dateFormat)}`

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setValue(moment().subtract(7-newValue, 'days').format(dateFormat))
        }
      };

    return (
        <Box sx={{ width: 300, margin: 2 }}>
            <Typography  sx={{ fontSize: 16, align: 'center'}}>
                {selectedDate}
            </Typography>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs>
                    <Slider
                        aria-label="Timeline"
                        defaultValue={7}
                        onChange={handleSliderChange}
                        step={1}
                        marks
                        min={1}
                        max={7}
                        valueLabelDisplay="off"
                    />
                </Grid>
                <Grid item>
                    <Typography sx={{ fontSize: 14 }}>
                        {rangeLabel}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}
