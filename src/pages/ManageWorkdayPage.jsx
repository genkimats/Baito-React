import Calendar from "react-calendar";
import "../css/Calendar.css";
import { useEffect, useState } from "react";
import {
  Switch,
  Typography,
  Button,
  TextField,
  MenuItem,
  InputLabel,
} from "@mui/material";
import "../css/ManageWorkdayPage.css";
import { useBaitoContext } from "../context/BaitoContext";

function ManageWorkdayPage() {
  const {
    DEFAULT_START_HOUR,
    DEFAULT_START_MINUTE,
    DEFAULT_END_HOUR,
    DEFAULT_END_MINUTE,
    PAY_INTERVAL_MINUTES,
    workdays,
    setWorkdays,
    savedDate,
    setSavedDate,
    addWorkday,
    updateWorkday,
    deleteWorkday,
  } = useBaitoContext();
  const initialDate = new Date();
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [isAddMode, setIsAddMode] = useState(true); // true -> Add , false -> Remove

  const [startTime, setStartTime] = useState({
    hour: DEFAULT_START_HOUR,
    minute: DEFAULT_START_MINUTE,
  });
  const [endTime, setEndTime] = useState({
    hour: DEFAULT_END_HOUR,
    minute: DEFAULT_END_MINUTE,
  });

  let calendarDate = new Date(
    savedDate.getFullYear(),
    savedDate.getMonth(),
    selectedDay
  );

  console.log(workdays);

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from(
    { length: 60 / PAY_INTERVAL_MINUTES },
    (_, i) => i * PAY_INTERVAL_MINUTES
  );

  const handleDayClick = (date) => {
    setSelectedDay(date.getDate());
    console.log(selectedDay);
  };

  const handleTimeChange = (timeType, field) => (e) => {
    e.preventDefault();
    const value = parseInt(e.target.value);

    if (timeType === "start") {
      if (field === "hour") {
        setStartTime((prev) => ({ ...prev, [field]: value }));
      } else {
        setStartTime((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      if (field === "hour") {
        setEndTime((prev) => ({ ...prev, [field]: value }));
      } else {
        setEndTime((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleToggle = (event) => {
    setIsAddMode(event.target.checked);
  };
  const handleAdd = (e) => {
    e.preventDefault();

    if (!workdays.some((workday) => workday.day === selectedDay)) {
      addWorkday({
        day: parseInt(selectedDay),
        startTime: startTime,
        endTime: endTime,
      });
      alert("Added!");
    } else {
      alert("Duplicate!");
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    alert("Removed!");
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (isAddMode) {
      handleAdd(e);
    } else {
      handleRemove(e);
    }
  };
  return (
    <div>
      <div className="mode-switch">
        <Typography
          sx={{
            color: !isAddMode ? "black" : "gray",
            fontWeight: !isAddMode ? "bold" : "normal",
          }}
        >
          Remove
        </Typography>

        <Switch checked={isAddMode} onChange={handleToggle} color="primary" />

        <Typography
          sx={{
            color: isAddMode ? "black" : "gray",
            fontWeight: isAddMode ? "bold" : "normal",
          }}
        >
          Add
        </Typography>
      </div>
      <Calendar
        className={"react-calendar"}
        value={calendarDate}
        onClickDay={handleDayClick}
        view="month"
        showNeighboringMonth={false}
        tileClassName={({ date }) =>
          workdays.some((workday) => workday.day === date.getDate())
            ? "workday"
            : ""
        }
      ></Calendar>

      <div className="select-time">
        {isAddMode ? (
          <>
            <div className="start-time">
              <TextField
                select
                value={startTime.hour}
                onChange={handleTimeChange("start", "hour")}
                label="Hours"
                size="small"
              >
                {hourOptions.map((hour) => (
                  <MenuItem key={`start-h-${hour}`} value={hour}>
                    {String(hour).padStart(2, "0")}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                value={startTime.minute}
                onChange={handleTimeChange("start", "minute")}
                label="Minutes"
                size="small"
                type="number"
                slotProps={{
                  InputLabel: {
                    shrink: true,
                  },
                }}
              >
                {minuteOptions.map((minute) => (
                  <MenuItem key={`start-h-${minute}`} value={minute}>
                    {String(minute).padStart(2, "0")}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="end-time">
              <TextField
                select
                value={endTime.hour}
                onChange={handleTimeChange("end", "hour")}
                label="Hours"
                size="small"
              >
                {hourOptions.map((hour) => (
                  <MenuItem key={`end-h-${hour}`} value={hour}>
                    {String(hour).padStart(2, "0")}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                value={endTime.minute}
                onChange={handleTimeChange("end", "minute")}
                label="Minutes"
                size="small"
              >
                {minuteOptions.map((minute) => (
                  <MenuItem key={`end-h-${minute}`} value={minute}>
                    {String(minute).padStart(2, "0")}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <Button variant="contained" onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  );
}

export default ManageWorkdayPage;
