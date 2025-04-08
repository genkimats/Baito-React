import Calendar from "react-calendar";
import "../css/Calendar.css";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import {
  Switch,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Paper,
} from "@mui/material";
import { BaitoContext } from "../context/BaitoContext";
import "../css/ManageWorkdayPage.css";
// import { useBaitoContext } from "../context/BaitoContext";

function ManageWorkdayPage() {
  const {
    DEFAULT_START_TIME,
    DEFAULT_END_TIME,
    WORKTIME_START,
    WORKTIME_END,
    PAY_INTERVAL_MINUTES,
    // workdays,
    // savedDate,
    // setSavedDate,
    addWorkday,
    updateWorkday,
    deleteWorkday,
    fetchWorkdays,
  } = useContext(BaitoContext);
  const [savedDate, setSavedDate] = useState(new Date());
  const [workdays, setWorkdays] = useState(fetchWorkdays());
  // const initialDate = new Date();
  // const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [isAddMode, setIsAddMode] = useState(true); // true -> Add , false -> Remove

  const [startTime, setStartTime] = useState({
    hour: DEFAULT_START_TIME.hour,
    minute: DEFAULT_START_TIME.minute,
  });
  const [endTime, setEndTime] = useState({
    hour: DEFAULT_END_TIME.hour,
    minute: DEFAULT_END_TIME.minute,
  });

  const startHourRef = useRef(null);
  const startMinuteRef = useRef(null);
  const endHourRef = useRef(null);
  const endMinuteRef = useRef(null);

  const body = document.body;
  const bodyRef = useRef(body);
  bodyRef.current.setAttribute("tabindex", "-1");

  // const calendarDate = useMemo(
  //   () => new Date(savedDate.getFullYear(), savedDate.getMonth(), selectedDay),
  //   [savedDate, selectedDay]
  // );

  const hourOptions = Array.from(
    { length: WORKTIME_END.hour - WORKTIME_START.hour + 1 },
    (_, i) => WORKTIME_START.hour + i
  );
  const minuteOptions = Array.from(
    { length: 60 / PAY_INTERVAL_MINUTES },
    (_, i) => i * PAY_INTERVAL_MINUTES
  );

  const [keyBuffer, setKeyBuffer] = useState("");
  const timeoutRef = useRef(null);

  const resetBuffer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setKeyBuffer(""), 500);
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      // e.preventDefault();
      // e.stopPropagation();
      if (e.key >= "0" && e.key <= "9") {
        const newBuffer = `${keyBuffer}${e.key}`.slice(-2);
        setKeyBuffer(newBuffer);
        const day = parseInt(newBuffer);
        if (day >= 1 && day <= 31) {
          setSavedDate(
            (prev) => new Date(prev.getFullYear(), prev.getMonth(), day)
          );
          console.log("Keyboard Shortcut: Changed day to", day);
          console.log(workdays);
        }
      } else if (e.key == " ") {
        if (isAddMode) setIsAddMode(false);
        else setIsAddMode(true);
      } else if (e.key === "Enter") {
        handleConfirm();
      } else if (e.key === "ArrowRight") {
        setSavedDate(
          (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
        );
      } else if (e.key === "ArrowLeft") {
        setSavedDate(
          (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
        );
      } else if (e.key === "Tab") {
        e.preventDefault();
        const focusedElement = document.activeElement;
        switch (focusedElement.id) {
          case "StartHour":
            startMinuteRef.current?.focus();
            break;
          case "StartMinute":
            endHourRef.current?.focus();
            break;
          case "EndHour":
            endMinuteRef.current?.focus();
            break;
          case "EndMinute":
            startHourRef.current?.focus();
            break;
          default:
            startHourRef.current?.focus();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keyBuffer, isAddMode, resetBuffer, savedDate]
  );

  useEffect(() => {
    setWorkdays(fetchWorkdays(savedDate.getFullYear(), savedDate.getMonth()));
  }, [savedDate, fetchWorkdays]);

  useEffect(() => {
    // setSavedDate(new Date());
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleDayClick = (date) => {
    setSavedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth(), date.getDate())
    );
  };

  const handleTimeChange = (timeType, field) => (e) => {
    e.preventDefault();
    const value = parseInt(e.target.value);

    if (timeType === "start") {
      setStartTime((prev) => ({ ...prev, [field]: value }));
    } else {
      setEndTime((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleToggle = (event) => {
    setIsAddMode(event.target.checked);
  };

  const handleConfirm = (e) => {
    e?.preventDefault?.();
    const selectedDay = savedDate.getDate();
    if (isAddMode) {
      if (!workdays.some((workday) => workday.day === selectedDay)) {
        addWorkday(savedDate.getFullYear(), savedDate.getMonth(), {
          day: selectedDay,
          startTime: startTime,
          endTime: endTime,
        });
      } else {
        updateWorkday(
          savedDate.getFullYear(),
          savedDate.getMonth(),
          selectedDay,
          {
            day: selectedDay,
            startTime: startTime,
            endTime: endTime,
          }
        );
      }
    } else {
      if (workdays.some((workday) => workday.day === selectedDay)) {
        deleteWorkday(
          savedDate.getFullYear(),
          savedDate.getMonth(),
          selectedDay
        );
      }
    }
  };

  return (
    <div id="workday-page">
      <div className="mode-switch">
        <Paper
          elevation={1}
          sx={{ display: "flex", alignItems: "center", gap: 2, padding: 2 }}
        >
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
        </Paper>
      </div>

      <div className="calendar-container">
        <Calendar
          className={"react-calendar"}
          value={savedDate}
          onClickDay={handleDayClick}
          onActiveStartDateChange={({ activeStartDate }) => {
            setSavedDate(
              new Date(
                activeStartDate.getFullYear(),
                activeStartDate.getMonth()
              )
            );
            bodyRef.current.focus();
          }}
          view="month"
          showNeighboringMonth={false}
          tileClassName={({ date }) =>
            workdays.some((workday) => workday.day === date.getDate())
              ? "workday"
              : ""
          }
        ></Calendar>
      </div>

      <div className="select-time">
        {isAddMode ? (
          <>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                marginY: 3,
                width: 225,
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "black", whiteSpace: "nowrap" }}>
                Start Time
              </Typography>
              <TextField
                select
                value={startTime.hour}
                onChange={handleTimeChange("start", "hour")}
                label="Hours"
                size="small"
                fullWidth
                inputRef={startHourRef}
                id="StartHour"
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
                fullWidth
                inputRef={startMinuteRef}
                id="StartMinute"
              >
                {minuteOptions.map((minute) => (
                  <MenuItem key={`start-h-${minute}`} value={minute}>
                    {String(minute).padStart(2, "0")}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                marginTop: 3,
                width: 225,
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "black", whiteSpace: "nowrap" }}>
                End Time
              </Typography>
              <TextField
                select
                value={endTime.hour}
                onChange={handleTimeChange("end", "hour")}
                label="Hours"
                size="small"
                fullWidth
                sx={{ marginLeft: 0.75 }}
                inputRef={endHourRef}
                id="EndHour"
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
                fullWidth
                inputRef={endMinuteRef}
                id="EndMinute"
              >
                {minuteOptions.map((minute) => (
                  <MenuItem key={`end-h-${minute}`} value={minute}>
                    {String(minute).padStart(2, "0")}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </>
        ) : null}
      </div>

      <Button
        variant="contained"
        onClick={handleConfirm}
        sx={{ marginY: 3, height: 40 }}
      >
        Confirm
      </Button>
    </div>
  );
}

export default ManageWorkdayPage;
