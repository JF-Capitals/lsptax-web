import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Define the data type for the chart
interface DataItem {
  name: string;
  value: number;
}

// Example data
const data: DataItem[] = [
  { name: "Category 1", value: 30 },
  { name: "Category 2", value: 50 },
  { name: "Category 3", value: 20 },
];

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"]; // Colors for each slice

const DonutChart: React.FC = () => (
  <PieChart width={400} height={400}>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%" // Center x position
      cy="50%" // Center y position
      innerRadius={40} // Inner radius to create the donut shape
      outerRadius={100} // Outer radius of the pie
      fill="#8884d8"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
);

export default DonutChart;
