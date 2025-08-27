import React, { useState, useEffect } from 'react';
import { BaitoContext } from './BaitoProvider';

export const BaitoManager = ({ children }) => {
  // Configs

  const [DEFAULT_START_TIME, setDefaultStartTime] = useState({
    hour: 17,
    minute: 0,
  });
  const [DEFAULT_END_TIME, setDefaultEndTime] = useState({
    hour: 22,
    minute: 0,
  });

  const [WORKTIME_START, setWorktimeStart] = useState({ hour: 17, minute: 0 });
  const [WORKTIME_END, setWorktimeEnd] = useState({ hour: 24, minute: 0 });

  const [PAY_INTERVAL_MINUTES, setPayIntervalMinutes] = useState(15);

  const [TIME_BARRIER, setTimeBarrier] = useState({ hour: 22, minute: 0 });

  const [COMMUTING_COST, setCommutingCost] = useState(230);

  const [WEEKDAY_WAGE, setWeekdayWage] = useState(1200);
  const [WEEKEND_WAGE, setWeekendWage] = useState(1500);

  useEffect(() => {
    const setDefaultIfNotExists = (key, defaultValue) => {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, defaultValue);
      }
    };

    setDefaultIfNotExists('DefaultStartHour', 17);
    setDefaultIfNotExists('DefaultStartMinute', 0);
    setDefaultIfNotExists('DefaultEndHour', 22);
    setDefaultIfNotExists('DefaultEndMinute', 0);
    setDefaultIfNotExists('EarliestStartHour', 17);
    setDefaultIfNotExists('EarliestStartMinute', 0);
    setDefaultIfNotExists('LatestEndHour', 24);
    setDefaultIfNotExists('LatestEndMinute', 0);
    setDefaultIfNotExists('WeekdayWage', 1200);
    setDefaultIfNotExists('WeekendWage', 1500);
    setDefaultIfNotExists('CommutingCost', 230);

    setDefaultStartTime({
      hour: parseInt(localStorage.getItem('DefaultStartHour')) || 17,
      minute: parseInt(localStorage.getItem('DefaultStartMinute')) || 0,
    });
    setDefaultEndTime({
      hour: parseInt(localStorage.getItem('DefaultEndHour')) || 22,
      minute: parseInt(localStorage.getItem('DefaultEndMinute')) || 0,
    });
    setWorktimeStart({
      hour: parseInt(localStorage.getItem('EarliestStartHour')) || 17,
      minute: parseInt(localStorage.getItem('EarliestStartMinute')) || 0,
    });
    setWorktimeEnd({
      hour: parseInt(localStorage.getItem('LatestEndHour')) || 24,
      minute: parseInt(localStorage.getItem('LatestEndMinute')) || 0,
    });
    setWeekdayWage(parseInt(localStorage.getItem('WeekdayWage')) || 1200);
    setWeekendWage(parseInt(localStorage.getItem('WeekendWage')) || 1500);
    setCommutingCost(parseInt(localStorage.getItem('CommutingCost')) || 230);
  }, []);

  // Managing workdays

  const fetchWorkdays = (year, month) => {
    let workdays = [];
    const workdaysStr = localStorage.getItem(`${year}-${String(month).padStart(2, '0')}`);
    try {
      if (workdaysStr) {
        workdays = JSON.parse(workdaysStr);
      }
    } catch (error) {
      console.error('Failed to parse saved workdays:', error);
    }
    return workdays;
  };

  const formatYearMonth = (year, month) => {
    return `${year}-${String(month).padStart(2, '0')}`;
  };

  const addWorkday = (year, month, newWorkday) => {
    let workdays = fetchWorkdays(year, month);
    if (!workdays.some((workday) => workday.day === newWorkday.day)) {
      const newWorkdays = [...workdays, newWorkday];
      localStorage.setItem(formatYearMonth(year, month), JSON.stringify(newWorkdays));
    }
  };

  const updateWorkday = (year, month, day, updatedWorkday) => {
    const weekdays = fetchWorkdays(year, month);
    const newWorkdays = weekdays.map((w) => (w.day === day ? updatedWorkday : w));
    localStorage.setItem(formatYearMonth(year, month), JSON.stringify(newWorkdays));
  };

  const deleteWorkday = (year, month, day) => {
    const workdays = fetchWorkdays(year, month);
    const newWorkdays = workdays.filter((w) => w.day !== day);
    localStorage.setItem(formatYearMonth(year, month), JSON.stringify(newWorkdays));
  };

  // Checking Salary

  const calculateDailySalary = (year, month) => {
    let dailySalary = [];

    const calculateSingleDay = (workday) => {
      let singleDaySalary = 0;
      const wage = workday.wage;
      if (
        workday.endTime.hour >= TIME_BARRIER.hour &&
        workday.endTime.minute > TIME_BARRIER.minute
      ) {
        // when over time-barrier
        singleDaySalary += (TIME_BARRIER.hour - workday.startTime.hour) * wage;
        singleDaySalary += ((TIME_BARRIER.minute - workday.startTime.minute) / 60) * wage;
        singleDaySalary += (workday.endTime.hour - TIME_BARRIER.hour) * wage * 1.25;
        singleDaySalary += ((workday.endTime.minute - TIME_BARRIER.minute) / 60) * wage * 1.25;
      } else {
        singleDaySalary += (workday.endTime.hour - workday.startTime.hour) * wage;
        singleDaySalary += ((workday.endTime.minute - workday.startTime.minute) / 60) * wage;
      }
      singleDaySalary += 2 * COMMUTING_COST;
      dailySalary.push(singleDaySalary);
    };
    const monthWorkdays = fetchWorkdays(year, month);
    monthWorkdays.forEach((workday) => calculateSingleDay(workday));
    return dailySalary;
  };

  const calculateMonthlySalary = (year) => {
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    let monthlySalaries = [];
    allMonths.forEach((month) => {
      monthlySalaries.push(
        calculateDailySalary(year, month).reduce((tempSum, a) => tempSum + a, 0)
      );
    });
    return monthlySalaries;
  };

  const value = {
    DEFAULT_START_TIME,
    DEFAULT_END_TIME,
    WORKTIME_START,
    WORKTIME_END,
    COMMUTING_COST,
    PAY_INTERVAL_MINUTES,
    WEEKDAY_WAGE,
    WEEKEND_WAGE,
    TIME_BARRIER,
    setDefaultStartTime,
    setDefaultEndTime,
    setWorktimeStart,
    setWorktimeEnd,
    setCommutingCost,
    setPayIntervalMinutes,
    setTimeBarrier,
    setWeekdayWage,
    setWeekendWage,
    fetchWorkdays,
    addWorkday,
    updateWorkday,
    deleteWorkday,
    calculateDailySalary,
    calculateMonthlySalary,
  };

  return <BaitoContext.Provider value={value}>{children}</BaitoContext.Provider>;
};
