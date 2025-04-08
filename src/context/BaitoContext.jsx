import React, { useContext, createContext } from "react";

export const BaitoContext = createContext();
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

  const formatYearMonth = (year, month) => {
    return `${year}-${String(month).padStart(2, "0")}`;
  };

  const addWorkday = (year, month, newWorkday) => {
    let workdays = fetchWorkdays(year, month);
    if (!workdays.some((workday) => workday.day === newWorkday.day)) {
      const newWorkdays = [...workdays, newWorkday];
      localStorage.setItem(
        formatYearMonth(year, month),
        JSON.stringify(newWorkdays)
      );
    }
  };

  const updateWorkday = (year, month, day, updatedWorkday) => {
    const weekdays = fetchWorkdays(year, month);
    const newWorkdays = weekdays.map((w) =>
      w.day === day ? updatedWorkday : w
    );
    localStorage.setItem(
      formatYearMonth(year, month),
      JSON.stringify(newWorkdays)
    );
  };

  const deleteWorkday = (year, month, day) => {
    const workdays = fetchWorkdays(year, month);
    const newWorkdays = workdays.filter((w) => w.day !== day);
    localStorage.setItem(
      formatYearMonth(year, month),
      JSON.stringify(newWorkdays)
    );
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
    const monthWorkdays = fetchWorkdays(year, month);
    console.log("Workdays: ", monthWorkdays);
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
