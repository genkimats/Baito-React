import { useContext, useState, useEffect } from 'react';
import { BaitoContext } from '../context/BaitoProvider';
import '../css/SettingsPage.css';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

function SettingsPage() {
  const {
    DEFAULT_START_TIME,
    DEFAULT_END_TIME,
    WORKTIME_START,
    WORKTIME_END,
    COMMUTING_COST,
    PAY_INTERVAL_MINUTES,
    WEEKDAY_WAGE,
    WEEKEND_WAGE,
    setDefaultStartTime,
    setDefaultEndTime,
    setWorktimeStart,
    setWorktimeEnd,
    setCommutingCost,
    setPayIntervalMinutes,
    setWeekdayWage,
    setWeekendWage,
  } = useContext(BaitoContext);

  // Temporary variables converted to state
  const [tempDefaultStartTime, setTempDefaultStartTime] = useState({
    hour: 0,
    minute: 0,
  });
  const [tempDefaultEndTime, setTempDefaultEndTime] = useState({
    hour: 0,
    minute: 0,
  });
  const [tempWorktimeStart, setTempWorktimeStart] = useState({
    hour: 0,
    minute: 0,
  });
  const [tempWorktimeEnd, setTempWorktimeEnd] = useState({
    hour: 0,
    minute: 0,
  });
  const [tempWeekdayWage, setTempWeekdayWage] = useState(0);
  const [tempWeekendWage, setTempWeekendWage] = useState(0);
  const [tempCommutingCost, setTempCommutingCost] = useState(0);
  const [tempPayIntervalMinutes, setTempPayIntervalMinutes] = useState(0);

  // Initialize temp states with original states
  useEffect(() => {
    setTempDefaultStartTime(DEFAULT_START_TIME);
    setTempDefaultEndTime(DEFAULT_END_TIME);
    setTempWorktimeStart(WORKTIME_START);
    setTempWorktimeEnd(WORKTIME_END);
    setTempWeekdayWage(WEEKDAY_WAGE);
    setTempWeekendWage(WEEKEND_WAGE);
    setTempCommutingCost(COMMUTING_COST);
    setTempPayIntervalMinutes(PAY_INTERVAL_MINUTES);
    console.log(WORKTIME_START.hour);
  }, [
    DEFAULT_START_TIME,
    DEFAULT_END_TIME,
    WORKTIME_START,
    WORKTIME_END,
    WEEKDAY_WAGE,
    WEEKEND_WAGE,
    COMMUTING_COST,
    PAY_INTERVAL_MINUTES,
  ]);

  const handleChange = (e, field) => {
    const newValue = parseInt(e.target.value);
    if (field === 'DefaultStartHour') {
      setTempDefaultStartTime((prev) => ({ ...prev, hour: newValue }));
    } else if (field === 'DefaultStartMinute') {
      setTempDefaultStartTime((prev) => ({ ...prev, minute: newValue }));
    } else if (field === 'DefaultEndHour') {
      setTempDefaultEndTime((prev) => ({ ...prev, hour: newValue }));
    } else if (field === 'DefaultEndMinute') {
      setTempDefaultEndTime((prev) => ({ ...prev, minute: newValue }));
    } else if (field === 'EarliestStartHour') {
      setTempWorktimeStart((prev) => ({ ...prev, hour: newValue }));
    } else if (field === 'EarliestStartMinute') {
      setTempWorktimeStart((prev) => ({ ...prev, minute: newValue }));
    } else if (field === 'LatestEndHour') {
      setTempWorktimeEnd((prev) => ({ ...prev, hour: newValue }));
    } else if (field === 'LatestEndMinute') {
      setTempWorktimeEnd((prev) => ({ ...prev, minute: newValue }));
    } else if (field === 'WeekdayWage') {
      setTempWeekdayWage(newValue);
    } else if (field === 'WeekendWage') {
      setTempWeekendWage(newValue);
    } else if (field === 'CommutingCost') {
      setTempCommutingCost(newValue);
    } else if (field === 'PayIntervalMinutes') {
      setTempPayIntervalMinutes(newValue);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Update shared states
    setDefaultStartTime(tempDefaultStartTime);
    setDefaultEndTime(tempDefaultEndTime);
    setWorktimeStart(tempWorktimeStart);
    setWorktimeEnd(tempWorktimeEnd);
    setWeekdayWage(tempWeekdayWage);
    setWeekendWage(tempWeekendWage);
    setCommutingCost(tempCommutingCost);
    setPayIntervalMinutes(tempPayIntervalMinutes);

    // Save to localStorage
    localStorage.setItem('DefaultStartHour', tempDefaultStartTime.hour);
    localStorage.setItem('DefaultStartMinute', tempDefaultStartTime.minute);
    localStorage.setItem('DefaultEndHour', tempDefaultEndTime.hour);
    localStorage.setItem('DefaultEndMinute', tempDefaultEndTime.minute);
    localStorage.setItem('EarliestStartHour', tempWorktimeStart.hour);
    localStorage.setItem('EarliestStartMinute', tempWorktimeStart.minute);
    localStorage.setItem('LatestEndHour', tempWorktimeEnd.hour);
    localStorage.setItem('LatestEndMinute', tempWorktimeEnd.minute);
    localStorage.setItem('WeekdayWage', tempWeekdayWage);
    localStorage.setItem('WeekendWage', tempWeekendWage);
    localStorage.setItem('CommutingCost', tempCommutingCost);
    localStorage.setItem('PayIntervalMinutes', tempPayIntervalMinutes);
  };

  const generateOptions = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((value) => (
      <MenuItem key={value} value={value}>
        {value}
      </MenuItem>
    ));
  };

  const generateMinuteOptions = (step) => {
    return Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step).map((value) => (
      <MenuItem key={value} value={value}>
        {value}
      </MenuItem>
    ));
  };

  return (
    <div className="page" id="settings-page">
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
        <Typography variant="h5" gutterBottom sx={{ marginBottom: 3 }}>
          Work Settings
        </Typography>

        <Box component="form" sx={{ display: 'grid', gap: 3 }}>
          {/* Work Hours Section */}
          <Paper elevation={2} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Default Work Hours
            </Typography>
            <Grid container spacing={2}>
              <Typography sx={{ width: 80 }}>Start Time:</Typography>
              <Grid>
                <TextField
                  select
                  label="Hour"
                  value={tempDefaultStartTime.hour}
                  onChange={(e) => handleChange(e, 'DefaultStartHour')}
                  sx={{ width: 90 }}
                >
                  {generateOptions(tempWorktimeStart.hour, tempWorktimeEnd.hour)}
                </TextField>
              </Grid>
              <Grid>
                <TextField
                  select
                  label="Minute"
                  value={tempDefaultStartTime.minute}
                  onChange={(e) => handleChange(e, 'DefaultStartMinute')}
                  sx={{ width: 90 }}
                >
                  {generateMinuteOptions(PAY_INTERVAL_MINUTES)}
                </TextField>
              </Grid>
              <Grid container spacing={2}>
                <Typography sx={{ width: 80 }}>End Time:</Typography>
                <Grid>
                  <TextField
                    select
                    label="Hour"
                    value={tempDefaultEndTime.hour}
                    onChange={(e) => handleChange(e, 'DefaultEndHour')}
                    sx={{ width: 90 }}
                  >
                    {generateOptions(tempWorktimeStart.hour, tempWorktimeEnd.hour)}
                  </TextField>
                </Grid>
                <Grid>
                  <TextField
                    select
                    label="Minute"
                    value={tempDefaultEndTime.minute}
                    onChange={(e) => handleChange(e, 'DefaultEndMinute')}
                    sx={{ width: 90 }}
                  >
                    {generateMinuteOptions(PAY_INTERVAL_MINUTES)}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Worktime Range */}
          <Paper elevation={2} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Worktime Range
            </Typography>
            <Grid container spacing={2}>
              <Grid container spacing={2}>
                <Typography sx={{ width: 80 }}>
                  Earliest <br></br>Start Time:
                </Typography>
                <Grid>
                  <TextField
                    select
                    label="Hour"
                    value={tempWorktimeStart.hour}
                    onChange={(e) => handleChange(e, 'EarliestStartHour')}
                    sx={{ width: 90 }}
                  >
                    {generateOptions(1, 24)}
                  </TextField>
                </Grid>
                <Grid>
                  <TextField
                    select
                    label="Minute"
                    value={tempWorktimeStart.minute}
                    onChange={(e) => handleChange(e, 'EarliestStartMinute')}
                    sx={{ width: 90 }}
                  >
                    {generateMinuteOptions(PAY_INTERVAL_MINUTES)}
                  </TextField>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Typography sx={{ width: 80 }}>
                  Latest <br></br>End Time:
                </Typography>
                <Grid>
                  <TextField
                    select
                    label="Hour"
                    value={tempWorktimeEnd.hour}
                    onChange={(e) => handleChange(e, 'LatestEndHour')}
                    sx={{ width: 90 }}
                  >
                    {generateOptions(1, 24)}
                  </TextField>
                </Grid>
                <Grid>
                  <TextField
                    select
                    label="Minute"
                    value={tempWorktimeEnd.minute}
                    onChange={(e) => handleChange(e, 'LatestEndMinute')}
                    sx={{ width: 90 }}
                  >
                    {generateMinuteOptions(PAY_INTERVAL_MINUTES)}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Wages Section */}
          <Paper elevation={2} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Default Wage Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid>
                <TextField
                  fullWidth
                  label="Weekday Wage"
                  type="number"
                  value={tempWeekdayWage}
                  onChange={(e) => handleChange(e, 'WeekdayWage')}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                    },
                  }}
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Weekend Wage"
                  type="number"
                  value={tempWeekendWage}
                  onChange={(e) => handleChange(e, 'WeekendWage')}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Other Settings */}
          <Paper elevation={2} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Other Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid>
                <TextField
                  fullWidth
                  label="Commuting Cost"
                  type="number"
                  value={tempCommutingCost}
                  onChange={(e) => handleChange(e, 'CommutingCost')}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                    },
                  }}
                />
              </Grid>
              <Grid>
                <TextField
                  sx={{ width: 210 }}
                  label="Pay Interval"
                  value={tempPayIntervalMinutes}
                  select
                  onChange={(e) => handleChange(e, 'PayIntervalMinutes')}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="start">min</InputAdornment>,
                    },
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              marginTop: 2,
            }}
          >
            {/* <Button variant="outlined">Cancel</Button> */}
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default SettingsPage;
