import React from "react";
import fs1 from "@/assets/icons/fs1.svg";
import fs2 from "@/assets/icons/fs2.svg";
import fs3 from "@/assets/icons/fs3.svg";
import fs4 from "@/assets/icons/fs4.svg";

interface FeatureEleProps {
  logo: string;
  figure: string;
  label: string;
}

const features = [
  { logo: fs1, figure: "900+", label: "Satisfied Clients" },
  { logo: fs2, figure: "50+", label: "Expert Agents" },
  { logo: fs3, figure: "10 years+", label: "Professional Experience" },
  { logo: fs4, figure: "2000+", label: "Protests Files" },
];

const FeatureStrip = () => {
  return (
    <div className="bg-[#14212A] text-[#02A6DC] flex justify-around">
      {features.map((item) => (
        <FeatureEle logo={item.logo} figure={item.figure} label={item.label} />
      ))}
    </div>
  );
};

const FeatureEle: React.FC<FeatureEleProps> = ({ logo, figure, label }) => {
  return (
    <div className="flex gap-8 p-4">
      <img src={logo} alt="" />
      <div>
        <h2 className="text-xl font-bold">{figure}</h2>
        <h3>{label}</h3>
      </div>
    </div>
  );
};

export default FeatureStrip;
