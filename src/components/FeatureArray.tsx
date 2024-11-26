import React from "react";
import f1 from "@/assets/icons/f1.svg"
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
    <div className="flex gap-4 justify-center relative -top-14 z-100">
      {
        features.map((item) => {
          return <FeatureBox label={item.label} logo={item.logo}/>
        })
      }
    </div>
  );
};

const FeatureBox: React.FC<FeatureBoxProps> = ({ label, logo }) => {
  return (
    <div className="flex border rounded-xl items-center p-4 px-8 shadow-md bg-white">
      <img src={logo} alt="logo" className="p-4" />
      <h2 className="bold p-4">{label}</h2>
    </div>
  );
};

export default FeatureArray;
