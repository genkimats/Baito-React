import { BarChart } from "@mui/x-charts";

import "../css/SalaryPage.css";
// import { useBaitoContext } from "../context/BaitoContext";
import { BaitoContext } from "../context/BaitoContext";
import DailySalariesChart from "../components/DailySalariesChart";
import MonthlySalariesChart from "../components/MonthlySalariesChart";
import { useEffect, useState, useContext } from "react";
import {
  TextField,
  IconButton,
  Box,
  Switch,
  Paper,
  Typography,
  InputAdornment,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

function SalaryPage() {
  const { fetchWorkdays, calculateDailySalary, calculateMonthlySalary } =
    useContext(BaitoContext);

  const [savedDate, setSavedDate] = useState(new Date());
  const [workdays, setWorkdays] = useState(
    fetchWorkdays(savedDate.getFullYear(), savedDate.getMonth())
  );

  useEffect(() => {
    setSavedDate(() => {
      const newDate = new Date();
      newDate.setDate(1); // set day that all months have
      newDate.setMonth(newDate.getMonth() + 1); // set to next month
      newDate.setDate(0); // set day to last day of prev month
      return newDate;
    });
  }, [setSavedDate]);

  const [isMonthView, setIsMonthView] = useState(true);

  const [monthViewInputValue, setMonthViewInputValue] = useState(
    formatDate(savedDate)
  );
  const [yearViewInputValue, setYearViewInputValue] = useState(
    savedDate.getFullYear()
  );

  // Daily salary vars

  const dailySalaries = calculateDailySalary(
    savedDate.getFullYear(),
    savedDate.getMonth()
  );
  const days = workdays.map((workday) => workday.day);

  const daysInMonth = savedDate.getDate();

  const dailySalariesArray = Array(daysInMonth).fill(0);
  days.map((day, index) => {
    dailySalariesArray[day - 1] = dailySalaries[index];
  });

  // Monthly salary vars

  const monthlySalaries = calculateMonthlySalary(savedDate.getFullYear());
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthlySalariesArray = Array(12).fill(0);
  months.map((month) => {
    monthlySalariesArray[month - 1] = monthlySalaries[month - 1];
  });

  const [error, setError] = useState("");

  useEffect(() => {
    setMonthViewInputValue(formatDate(savedDate));
  }, [savedDate]);

  // Format as YYYY-MM
  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }

  const changeMonth = (delta) => {
    setSavedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(1); // set day that all months have
      newDate.setMonth(newDate.getMonth() + delta);
      newDate.setMonth(newDate.getMonth() + 1); // set to next month
      newDate.setDate(0); // set day to last day of prev month
      return newDate;
    });
    setError("");
  };

  const changeYear = (delta) => {
    setYearViewInputValue((prev) => {
      const newYear = prev + delta;
      return newYear;
    });
  };

  const updateDate = (date) => {
    const formatted = formatDate(date);
    setSavedDate(date);
    setMonthViewInputValue(formatted);
    setError("");
  };

  const handleToggle = (e) => {
    setIsMonthView(e.target.checked);
  };

  const handleMonthInputChange = (e) => {
    const value = e.target.value;
    setMonthViewInputValue(value);

    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
      const [year, month] = value.split("-").map(Number);
      updateDate(new Date(year, month - 1));
    }
  };

  const handleBarClick = (e, { seriesId, dataIndex }) => {
    setIsMonthView((prev) => !prev);
    setMonthViewInputValue(`${yearViewInputValue}-${dataIndex + 1}`);
  };

  const handleYearInputChange = (e) => {
    const value = e.target.value;
    setYearViewInputValue(value);
  };

  const handleBlur = () => {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(monthViewInputValue)) {
      setError("Please use YYYY-MM format");
      setMonthViewInputValue(formatDate(savedDate));
    }
  };

  return (
    <div id="salary-page">
      <Paper
        elevation={1}
        sx={{ display: "flex", alignItems: "center", gap: 2, padding: 2 }}
      >
        <Typography
          sx={{
            color: !isMonthView ? "black" : "gray",
            fontWeight: !isMonthView ? "bold" : "normal",
          }}
        >
          Year View
        </Typography>

        <Switch checked={isMonthView} onChange={handleToggle} color="primary" />

        <Typography
          sx={{
            color: isMonthView ? "black" : "gray",
            fontWeight: isMonthView ? "bold" : "normal",
          }}
        >
          Month View
        </Typography>
      </Paper>
      {isMonthView ? (
        <>
          <Paper
            className="monthView"
            elevation={3}
            sx={{
              paddingX: 2,
              paddingBottom: 0,
              paddingTop: 0.25,
              maxWidth: 300,
              height: 90,
              marginBottom: 0,
            }}
          >
            <TextField
              fullWidth
              label="YYYY-MM"
              value={monthViewInputValue}
              onChange={handleMonthInputChange}
              onBlur={handleBlur}
              error={!!error}
              helperText={error || " "}
              margin="normal"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => changeMonth(-1)} size="small">
                        <ChevronLeft />
                      </IconButton>
                      <IconButton onClick={() => changeMonth(1)} size="small">
                        <ChevronRight />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Paper>

          <DailySalariesChart
            salaries={dailySalariesArray}
          ></DailySalariesChart>
        </>
      ) : (
        <>
          <Paper
            className="yearView"
            elevation={3}
            sx={{
              paddingX: 2,
              paddingBottom: 0,
              paddingTop: 0.25,
              maxWidth: 300,
              height: 90,
              // marginBottom: 10,
            }}
          >
            <TextField
              fullWidth
              label="YYYY"
              value={yearViewInputValue}
              onChange={handleYearInputChange}
              onBlur={handleBlur}
              error={!!error}
              helperText={error || " "}
              margin="normal"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => changeYear(-1)} size="small">
                        <ChevronLeft />
                      </IconButton>
                      <IconButton onClick={() => changeYear(1)} size="small">
                        <ChevronRight />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Paper>

          <MonthlySalariesChart
            salaries={monthlySalariesArray}
            onItemClick={handleBarClick}
          ></MonthlySalariesChart>
        </>
      )}
    </div>
  );
}

export default SalaryPage;
