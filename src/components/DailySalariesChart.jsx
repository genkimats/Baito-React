import React from "react";
import { BarChart } from "@mui/x-charts";

const DailySalariesChart = ({ salaries }) => {
  // Create array for all days in month (1-31)
  const allDays = Array.from({ length: salaries.length }, (_, i) => i + 1);

  // Merge with salaries data (fill missing days with 0)
  const chartData = allDays.map((day) => ({
    day: day.toString(),
    salary: salaries[day - 1] || 0, // day-1 for array index
  }));

  return (
    <BarChart
      dataset={chartData}
      xAxis={[
        {
          scaleType: "band",
          dataKey: "day",
          label: "Day of Month",
        },
      ]}
      yAxis={[
        {
          // label: "Salary (¥)",
          min: 0,
        },
      ]}
      series={[
        {
          dataKey: "salary",
          label: "Daily Salary",
          color: "#4caf50",
        },
      ]}
      width={1000}
      height={400}
    />
  );
};

export default DailySalariesChart;
