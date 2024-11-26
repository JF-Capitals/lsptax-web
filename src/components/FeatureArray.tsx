import React from "react";
import f1 from "@/assets/icons/f1.svg";
import f2 from "@/assets/icons/f2.svg";
import f3 from "@/assets/icons/f3.svg";
import f4 from "@/assets/icons/f4.svg";

interface FeatureBoxProps {
  label: string;
  logo: string;
}

const features = [
  {
    label: "Maximized Tax Savings",
    logo: f1,
  },
  {
    label: "Financial Freedom",
    logo: f2,
  },
  {
    label: "Significant Tax Relief",
    logo: f3,
  },
  {
    label: "Property Tax Relief",
    logo: f4,
  },
];

const FeatureArray = () => {
  return (
    <div className="flex flex-col md:flex-row md:mx-8 gap-6 justify-center relative -top-14 z-10">
      {features.map((item, index) => (
        <FeatureBox key={index} label={item.label} logo={item.logo} />
      ))}
    </div>
  );
};

const FeatureBox: React.FC<FeatureBoxProps> = ({ label, logo }) => {
  return (
    <div className="flex flex-col items-center border rounded-xl p-4 px-6 shadow-md bg-white w-full md:w-1/4">
      <img src={logo} alt="logo" className="w-16 h-16 mb-4" />
      <h2 className="font-semibold text-center text-lg">{label}</h2>
    </div>
  );
};

export default FeatureArray;
