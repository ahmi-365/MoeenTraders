// src/context/MonthYearContext.tsx
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

type MonthYearContextType = {
  month: number;
  year: number;
  setMonth: (m: number) => void;
  setYear: (y: number) => void;
};

const MonthYearContext = createContext<MonthYearContextType | undefined>(undefined);

export const MonthYearProvider = ({ children }: { children: ReactNode }) => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  return (
    <MonthYearContext.Provider value={{ month, year, setMonth, setYear }}>
      {children}
    </MonthYearContext.Provider>
  );
};

export const useMonthYear = () => {
  const context = useContext(MonthYearContext);
  if (!context) throw new Error("useMonthYear must be used inside MonthYearProvider");
  return context;
};
