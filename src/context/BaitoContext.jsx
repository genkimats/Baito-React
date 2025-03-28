import { createContext, useState, useContext, useEffect } from "react";

const BaitoContext = createContext();

export const useBaitoContext = () => useContext(BaitoContext);

export const BaitoManager = ({ children }) => {
  // Configs
  const DEFAULT_START_HOUR = 17;
  const DEFAULT_START_MINUTE = 0;
  const DEFAULT_END_HOUR = 22;
  const DEFAULT_END_MINUTE = 0;

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

  const updateWorkday = (id, updatedWorkday) => {
    setWorkdays((prev) => prev.map((w) => (w.id === id ? updatedWorkday : w)));
  };

  const deleteWorkday = (id) => {
    setWorkdays((prev) => prev.filter((w) => w.id !== id));
  };

  const value = {
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
  };

  return (
    <BaitoContext.Provider value={value}>{children}</BaitoContext.Provider>
  );
};
