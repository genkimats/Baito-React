// /* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useContext, useEffect } from "react";

const BaitoContext = createContext();

export const useBaitoContext = () => useContext(BaitoContext);

export const BaitoManager = ({ children }) => {
  // Configs
  const DEFAULT_START_TIME = { hour: 17, minute: 0 };
  const DEFAULT_END_TIME = { hour: 22, minute: 0 };

  const WORKTIME_START = { hour: 17, minute: 0 };
  const WORKTIME_END = { hour: 24, minute: 0 };

  const PAY_INTERVAL_MINUTES = 15;

  const TIME_BARRIER = { hour: 22, minute: 0 };

  const WEEKDAY_WAGE = 1200;
  const WEEKEND_WAGE = 1500;

  // Managing workdays
  const [savedDate, setSavedDate] = useState(new Date());
  const yearMonth = `${savedDate.getFullYear()}-${String(
    savedDate.getMonth() + 1
  ).padStart(2, "0")}`;
  const [workdays, setWorkdays] = useState([]);

  useEffect(() => {
    const workdaysStr = localStorage.getItem(yearMonth);
    try {
      if (workdaysStr) setWorkdays(JSON.parse(workdaysStr));
    } catch (error) {
      console.error("Failed to parse saved workdays:", error);
    }
  }, [savedDate, yearMonth]);

  const fetchWorkdays = (year, month) => {
    let workdays = [];
    const workdaysStr = localStorage.getItem(
      `${year}-${String(month).padStart(2, "0")}`
    );
    try {
      if (workdaysStr) {
        workdays = JSON.parse(workdaysStr);
      }
    } catch (error) {
      console.error("Failed to parse saved workdays:", error);
    }
    return workdays;
  };

  const addWorkday = (newWorkday) => {
    if (!workdays.some((workday) => workday.day === newWorkday.day))
      setWorkdays((prev) => {
        const newWorkdays = [...prev, newWorkday];
        localStorage.setItem(yearMonth, JSON.stringify(newWorkdays));
        return newWorkdays;
      });
  };

  const updateWorkday = (day, updatedWorkday) => {
    setWorkdays((prev) => {
      const newWorkdays = prev.map((w) => (w.day === day ? updatedWorkday : w));
      localStorage.setItem(yearMonth, JSON.stringify(newWorkdays));
      return newWorkdays;
    });
  };

  const deleteWorkday = (day) => {
    setWorkdays((prev) => {
      const newWorkdays = prev.filter((w) => w.day !== day);
      localStorage.setItem(yearMonth, JSON.stringify(newWorkdays));
      return newWorkdays;
    });
  };

  // Checking Salary

  const calculateDailySalary = (year, month) => {
    let dailySalary = [];

    const calculateSingleDay = (workday) => {
      let singleDaySalary = 0;
      const currentDate = new Date(year, month, workday.day);
      const wage =
        currentDate.getDay() === 0 || currentDate.getDay() === 6
          ? WEEKEND_WAGE
          : WEEKDAY_WAGE;
      if (
        workday.endTime.hour >= TIME_BARRIER.hour &&
        workday.endTime.minute > TIME_BARRIER.minute
      ) {
        // when over time-barrier
        singleDaySalary += (TIME_BARRIER.hour - workday.startTime.hour) * wage;
        singleDaySalary +=
          ((TIME_BARRIER.minute - workday.startTime.minute) / 60) * wage;
        singleDaySalary +=
          (workday.endTime.hour - TIME_BARRIER.hour) * wage * 1.25;
        singleDaySalary +=
          ((workday.endTime.minute - TIME_BARRIER.minute) / 60) * wage * 1.25;

        dailySalary.push(singleDaySalary);
      } else {
        singleDaySalary +=
          (workday.endTime.hour - workday.startTime.hour) * wage;
        singleDaySalary +=
          ((workday.endTime.minute - workday.startTime.minute) / 60) * wage;

        dailySalary.push(singleDaySalary);
      }
    };
    const monthWorkdaysStr = localStorage.getItem(
      `${year}-${String(month).padStart(2, "0")}`
    );
    let monthWorkdays = [];
    try {
      if (monthWorkdaysStr) {
        monthWorkdays = JSON.parse(monthWorkdaysStr);
      }
    } catch (error) {
      console.error("Failed to parse saved workdays:", error);
    }
    monthWorkdays.forEach((workday) => calculateSingleDay(workday));
    return dailySalary;
  };

  const calculateMonthlySalary = (year) => {
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    let monthlySalaries = [];
    allMonths.forEach((month) => {
      monthlySalaries.push(
        calculateDailySalary(year, month).reduce(
          (partialSum, a) => partialSum + a,
          0
        )
      );
    });
    return monthlySalaries;
  };

  const value = {
    DEFAULT_START_TIME,
    DEFAULT_END_TIME,
    WORKTIME_START,
    WORKTIME_END,
    PAY_INTERVAL_MINUTES,
    workdays,
    setWorkdays,
    savedDate,
    setSavedDate,
    fetchWorkdays,
    addWorkday,
    updateWorkday,
    deleteWorkday,
    calculateDailySalary,
    calculateMonthlySalary,
  };

  return (
    <BaitoContext.Provider value={value}>{children}</BaitoContext.Provider>
  );
};
