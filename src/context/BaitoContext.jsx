import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BaitoContext } from './BaitoProvider';

export const BaitoManager = ({ children }) => {
  // --- State Definitions ---
  const [DEFAULT_START_TIME, setDefaultStartTime] = useState({ hour: 17, minute: 0 });
  const [DEFAULT_END_TIME, setDefaultEndTime] = useState({ hour: 22, minute: 0 });
  const [WORKTIME_START, setWorktimeStart] = useState({ hour: 17, minute: 0 });
  const [WORKTIME_END, setWorktimeEnd] = useState({ hour: 24, minute: 0 });
  const [PAY_INTERVAL_MINUTES, setPayIntervalMinutes] = useState(15);
  const [TIME_BARRIER, setTimeBarrier] = useState({ hour: 22, minute: 0 });
  const [COMMUTING_COST, setCommutingCost] = useState(230);
  const [WEEKDAY_WAGE, setWeekdayWage] = useState(1200);
  const [WEEKEND_WAGE, setWeekendWage] = useState(1500);
  const [isLoading, setIsLoading] = useState(true); // To handle initial load

  // --- Fetch Settings from Firebase on App Load ---
  useEffect(() => {
    const fetchSettings = async () => {
      const settingsRef = doc(db, 'settings', 'user_settings');
      const docSnap = await getDoc(settingsRef);

      if (docSnap.exists()) {
        const settings = docSnap.data();
        setDefaultStartTime(settings.DEFAULT_START_TIME || { hour: 17, minute: 0 });
        setDefaultEndTime(settings.DEFAULT_END_TIME || { hour: 22, minute: 0 });
        setWorktimeStart(settings.WORKTIME_START || { hour: 17, minute: 0 });
        setWorktimeEnd(settings.WORKTIME_END || { hour: 24, minute: 0 });
        setPayIntervalMinutes(settings.PAY_INTERVAL_MINUTES || 15);
        setCommutingCost(settings.COMMUTING_COST || 230);
        setWeekdayWage(settings.WEEKDAY_WAGE || 1200);
        setWeekendWage(settings.WEEKEND_WAGE || 1500);
      } else {
        // FIX: If no document, create one with the default values
        console.log('No settings document, creating one with default values.');
        const defaultSettings = {
          DEFAULT_START_TIME: { hour: 17, minute: 0 },
          DEFAULT_END_TIME: { hour: 22, minute: 0 },
          WORKTIME_START: { hour: 17, minute: 0 },
          WORKTIME_END: { hour: 24, minute: 0 },
          PAY_INTERVAL_MINUTES: 15,
          COMMUTING_COST: 230,
          WEEKDAY_WAGE: 1200,
          WEEKEND_WAGE: 1500,
        };
        await setDoc(settingsRef, defaultSettings);
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  // --- New function to save settings to Firebase ---
  const saveSettings = async (newSettings) => {
    const settingsRef = doc(db, 'settings', 'user_settings');
    await setDoc(settingsRef, newSettings, { merge: true }); // merge: true prevents overwriting
  };

  // ... (rest of your context functions like fetchWorkdays, calculateDailySalary, etc.)
  const formatDocId = (year, month) => {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
  };

  const fetchWorkdays = async (year, month) => {
    const docId = formatDocId(year, month);
    const docRef = doc(db, 'workdays', docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().workdays || [];
    }
    return [];
  };
  const addWorkday = async (year, month, newWorkday) => {
    const docId = formatDocId(year, month);
    const docRef = doc(db, 'workdays', docId);
    const workdays = await fetchWorkdays(year, month);
    const newWorkdays = [...workdays, newWorkday];
    await setDoc(docRef, { workdays: newWorkdays });
  };

  const updateWorkday = async (year, month, day, updatedWorkday) => {
    const docId = formatDocId(year, month);
    const docRef = doc(db, 'workdays', docId);
    const workdays = await fetchWorkdays(year, month);
    const newWorkdays = workdays.map((w) => (w.day === day ? updatedWorkday : w));
    await setDoc(docRef, { workdays: newWorkdays });
  };

  const deleteWorkday = async (year, month, day) => {
    const docId = formatDocId(year, month);
    const docRef = doc(db, 'workdays', docId);
    const workdays = await fetchWorkdays(year, month);
    const newWorkdays = workdays.filter((w) => w.day !== day);
    await setDoc(docRef, { workdays: newWorkdays });
  };
  const calculateDailySalary = (workdays) => {
    if (!workdays || workdays.length === 0) {
      return [];
    }

    let dailySalary = [];

    const calculateSingleDay = (workday) => {
      let singleDaySalary = 0;
      const wage = workday.wage;
      if (
        workday.endTime.hour >= TIME_BARRIER.hour &&
        workday.endTime.minute > TIME_BARRIER.minute
      ) {
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

    workdays.forEach((workday) => calculateSingleDay(workday));
    return dailySalary;
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
    isLoading, // Pass loading state to components
    setDefaultStartTime,
    setDefaultEndTime,
    setWorktimeStart,
    setWorktimeEnd,
    setCommutingCost,
    setPayIntervalMinutes,
    setTimeBarrier,
    setWeekdayWage,
    setWeekendWage,
    saveSettings, // Add the new save function
    fetchWorkdays,
    addWorkday,
    updateWorkday,
    deleteWorkday,
    calculateDailySalary,
  };

  return <BaitoContext.Provider value={value}>{children}</BaitoContext.Provider>;
};
