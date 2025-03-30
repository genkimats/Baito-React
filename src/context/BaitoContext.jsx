import { createContext, useState, useContext, useEffect } from "react";

const BaitoContext = createContext();

export const useBaitoContext = () => useContext(BaitoContext);

export const BaitoManager = ({ children }) => {
  // Configs
  const DEFAULT_START_TIME = { hour: 17, minute: 0 };
  const DEFAULT_END_TIME = { hour: 22, minute: 0 };

  const WORKTIME_START = { hour: 17, minute: 0 };
  const WORKTIME_END = { hour: 24, minute: 0 };

  const PAY_INTERVAL_MINUTES = 15;

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

  useEffect(() => {
    localStorage.setItem(yearMonth, JSON.stringify(workdays));
  }, [workdays, yearMonth]);

  const addWorkday = (newWorkday) => {
    setWorkdays((prev) => [...prev, newWorkday]);
  };

  const updateWorkday = (day, updatedWorkday) => {
    setWorkdays((prev) =>
      prev.map((w) => (w.day === day ? updatedWorkday : w))
    );
  };

  const deleteWorkday = (day) => {
    setWorkdays((prev) => prev.filter((w) => w.day !== day));
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
    addWorkday,
    updateWorkday,
    deleteWorkday,
  };

  return (
    <BaitoContext.Provider value={value}>{children}</BaitoContext.Provider>
  );
};
