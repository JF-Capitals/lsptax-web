import React from "react";
import s1 from "@/assets/services/s1.svg"

interface ServiceBoxProps {
  logo: string;
  label: string;
  desc: string;
  ctaLink: string;
}

const services = [
  {
    logo: s1,
    label: "Expertise in Savings",
    desc: "Our team specializes in Texas property tax laws and knows the ins and outs of local tax assessments.",
    ctaLink: "",
  },
  {
    logo: s1,
    label: "Client-Focused Service",
    desc: "We bring our members high quality commercial investment opportunities that are normally hidden away in country clubs or investment firms.",
    ctaLink: "",
  },
  {
    logo: s1,
    label: "Risk-Free Savings ",
    desc: "Our “No Savings, No Fee” policy means you only pay if we reduce your taxes. If we can’t lower your property tax bill, there’s no cost to you. ",
    ctaLink: "",
  },
  {
    logo: s1,
    label: "Expertise in Savings",
    desc: "Our team specializes in Texas property tax laws and knows the ins and outs of local tax assessments.",
    ctaLink: "",
  },
  {
    logo: s1,
    label: "Client-Focused Service",
    desc: "We bring our members high quality commercial investment opportunities that are normally hidden away in country clubs or investment firms.",
    ctaLink: "",
  },
  {
    logo: s1,
    label: "Risk-Free Savings ",
    desc: "Our “No Savings, No Fee” policy means you only pay if we reduce your taxes. If we can’t lower your property tax bill, there’s no cost to you. ",
    ctaLink: "",
  },
];

const Services = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold text-2xl p-8">Our Core Services</h2>
      {/* Add a grid layout to control the number of items in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 m-8 mb-16">
        {services.map((item, index) => (
          <ServiceBox
            key={index}
            logo={item.logo}
            label={item.label}
            desc={item.desc}
            ctaLink={item.ctaLink}
          />
        ))}
      </div>
    </div>
  );
};


const ServiceBox: React.FC<ServiceBoxProps> = ({
  logo,
  label,
  desc,
  ctaLink,
}) => {
  return (
    <div className="flex flex-col border w-64 h-96  items-center  p-4 rounded-xl shadow">
      <img src={logo} alt="" />
      <h2 className="font-semibold text-lg">{label}</h2>
      <p className="text-center">{desc}</p>
      <a href={ctaLink} className="bg-red-400 text-white text-xs rounded-3xl p-2 px-4 my-4">Get Started Now -</a>
    </div>
  );
};
export default Services;
