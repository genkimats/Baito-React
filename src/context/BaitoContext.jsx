import React, { createContext, useState, useEffect, useContext } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { BaitoContext } from './BaitoProvider';

export const BaitoManager = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default settings state
  const [DEFAULT_START_TIME, setDefaultStartTime] = useState({ hour: 17, minute: 0 });
  const [DEFAULT_END_TIME, setDefaultEndTime] = useState({ hour: 22, minute: 0 });
  const [WORKTIME_START, setWorktimeStart] = useState({ hour: 17, minute: 0 });
  const [WORKTIME_END, setWorktimeEnd] = useState({ hour: 24, minute: 0 });
  const [PAY_INTERVAL_MINUTES, setPayIntervalMinutes] = useState(15);
  const [TIME_BARRIER, setTimeBarrier] = useState({ hour: 22, minute: 0 });
  const [COMMUTING_COST, setCommutingCost] = useState(230);
  const [WEEKDAY_WAGE, setWeekdayWage] = useState(1200);
  const [WEEKEND_WAGE, setWeekendWage] = useState(1500);

  // --- Authentication Functions ---
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // --- Auth State Observer ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // --- Data Management Functions ---
  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const fetchSettings = async () => {
      const settingsRef = doc(db, 'users', currentUser.uid, 'settings', 'main');
      const docSnap = await getDoc(settingsRef);

      if (docSnap.exists()) {
        const settings = docSnap.data();
        setDefaultStartTime(settings.DEFAULT_START_TIME);
        setDefaultEndTime(settings.DEFAULT_END_TIME);
        setWorktimeStart(settings.WORKTIME_START);
        setWorktimeEnd(settings.WORKTIME_END);
        setPayIntervalMinutes(settings.PAY_INTERVAL_MINUTES);
        setCommutingCost(settings.COMMUTING_COST);
        setWeekdayWage(settings.WEEKDAY_WAGE);
        setWeekendWage(settings.WEEKEND_WAGE);
      } else {
        console.log('No settings document for user, using defaults.');
      }
    };

    fetchSettings();
  }, [currentUser]);

  const saveSettings = async (newSettings) => {
    if (!currentUser) return;
    const settingsRef = doc(db, 'users', currentUser.uid, 'settings', 'main');
    await setDoc(settingsRef, newSettings, { merge: true });
  };

  const fetchWorkdays = async (year, month) => {
    if (!currentUser) return [];
    const docId = `${year}-${String(month).padStart(2, '0')}`;
    const docRef = doc(db, 'users', currentUser.uid, 'workdays', docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().workdays : [];
  };

  const addWorkday = async (year, month, newWorkday) => {
    if (!currentUser) return;
    const docId = `${year}-${String(month).padStart(2, '0')}`;
    const docRef = doc(db, 'users', currentUser.uid, 'workdays', docId);
    const workdays = await fetchWorkdays(year, month);
    const newWorkdays = [...workdays, newWorkday];
    await setDoc(docRef, { workdays: newWorkdays });
  };

  const updateWorkday = async (year, month, day, updatedWorkday) => {
    if (!currentUser) return;
    const docId = `${year}-${String(month).padStart(2, '0')}`;
    const docRef = doc(db, 'users', currentUser.uid, 'workdays', docId);
    const workdays = await fetchWorkdays(year, month);
    const newWorkdays = workdays.map((w) => (w.day === day ? updatedWorkday : w));
    await setDoc(docRef, { workdays: newWorkdays });
  };

  const deleteWorkday = async (year, month, day) => {
    if (!currentUser) return;
    const docId = `${year}-${String(month).padStart(2, '0')}`;
    const docRef = doc(db, 'users', currentUser.uid, 'workdays', docId);
    const workdays = await fetchWorkdays(year, month);
    const newWorkdays = workdays.filter((w) => w.day !== day);
    await setDoc(docRef, { workdays: newWorkdays });
  };

  const calculateDailySalary = (workdays) => {
    if (!workdays || workdays.length === 0) {
      return [];
    }
    let dailySalary = [];
    workdays.forEach((workday) => {
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
    });
    return dailySalary;
  };

  const value = {
    currentUser,
    isLoading,
    signup,
    login,
    logout,
    loginWithGoogle,
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
    saveSettings,
    fetchWorkdays,
    addWorkday,
    updateWorkday,
    deleteWorkday,
    calculateDailySalary,
  };

  return <BaitoContext.Provider value={value}>{!isLoading && children}</BaitoContext.Provider>;
};
