import React from "react";
import { BarChart } from "@mui/x-charts";
import "../css/MonthlySalariesChart.css";

const MonthlySalariesChart = ({ salaries, onItemClick }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = months.map((month, index) => ({
    month: month,
    salary: salaries[index] || 0,
  }));

  return (
    <div className="chart-container">
      <BarChart
        dataset={chartData}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "month",
            label: "Month of Year",
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
            label: "Monthly Salary",
            color: "#4caf50",
          },
        ]}
        onItemClick={onItemClick}
      />
    </div>
  );
};

export default MonthlySalariesChart;
