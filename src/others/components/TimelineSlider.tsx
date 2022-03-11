import { Box, Grid, Slider, Typography } from "@mui/material";
import React from "react";
import moment from "moment";

const dateFormat = 'DD.MM'

export function TimelineSlider() {
    let todayDate = moment()
    let weekBeforeDate = moment().subtract(7, 'days')
    const [selectedDateValue, setValue] = React.useState(moment);
    const rangeLabel = `${weekBeforeDate.format(dateFormat)} - ${todayDate.format(dateFormat)}`

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setValue(moment().subtract(7 - newValue, 'days'))
        }
    };

    return (
        <Box sx={{
            width: 350, m:2, padding: 1, borderRadius: "20px",
            backgroundColor: "#000",
            color: "#fff"
        }}>
            <Typography sx={{ fontSize: 16, marginLeft: 12 }}>
                {selectedDateValue.format(dateFormat)}
            </Typography>
            <Grid container spacing={3} alignItems="center">
                <Grid item xs sx={{ marginLeft: 2 }}>
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
                    <Typography sx={{ fontSize: 14, marginRight: 2 }}>
                        {rangeLabel}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}
