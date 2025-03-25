import Calendar from "react-calendar";
import "../css/Calendar.css";
import { useEffect, useState } from "react";
import { Switch, Typography, Button } from "@mui/material";
import "../css/ManageWorkdayPage.css";
import { useBaitoContext } from "../context/BaitoContext";

function ManageWorkdayPage() {
  const {
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

  const handleDayClick = (date) => {
    setSelectedDay(date);
    console.log(selectedDay);
  };

  const handleToggle = (event) => {
    setIsAddMode(event.target.checked);
  };
  const handleAdd = (e) => {
    e.preventDefault();
    alert("Added!");

    addWorkday({});
  };

  const handleRemove = (e) => {
    e.preventDefault();
    alert("Removed!");
  };

  const handleConfirm = (e) => {
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
        value={
          new Date(savedDate.getFullYear(), savedDate.getMonth(), selectedDay)
        }
        onClickDay={handleDayClick}
        view="month"
        showNeighboringMonth={false}
      ></Calendar>

      <div className="select-time">
        {isAddMode ? <p>Select time here</p> : <></>}
      </div>

      <Button variant="contained" onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  );
}

export default ManageWorkdayPage;
