import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Define the data type for the chart
interface DataItem {
  name: string;
  value: number;
}

// Example data
const data: DataItem[] = [
  { name: "Pending", value: 30 },
  { name: "Completed", value: 50 },
  { name: "Submitted", value: 20 },
];

const COLORS = ["#F29425", "#10A142", "#E54F53"]; // Colors for each slice

const DonutChart: React.FC = () => (
  <div className="flex justify-around items-center bg-white rounded-xl h-full">
    {/* Legend Section */}
    <div className="flex  flex-col items-start mr-4">
      <h1 className="font-bold text-xl mb-6">500 Total Applications</h1>
      {data.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center mb-2">
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: COLORS[index % COLORS.length],
              marginRight: 8,
            }}
          ></div>
          <div className="flex gap-2 font-bold">
            <span>{entry.value}</span>
            <span>{entry.name}</span>
          </div>
        </div>
      ))}
    </div>
    {/* Donut Chart Section */}
    <PieChart width={250} height={250} className="">
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
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </div>
);

export default DonutChart;
