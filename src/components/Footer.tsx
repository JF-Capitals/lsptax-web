import React from "react";
import { NavLink } from "react-router-dom";

const footerListItems = [
  {
    title: "Company Registration",
    items: [
      { label: "Private Limited", link: "#" },
      { label: "Public Limited", link: "#" },
      { label: "Private Limited", link: "#" },
      { label: "Private Limited", link: "#" },
    ],
  },
  {
    title: "Licences & Registrations",
    items: [
      { label: "GST Registration", link: "#" },
      { label: "MSME Registration", link: "#" },
      { label: "FSSAI Registration", link: "#" },
      { label: "ISO Registration", link: "#" },
    ],
  },
  {
    title: "Intellectual Property Rights",
    items: [
      { label: "Trademark Registration", link: "#" },
      { label: "Copyright Registration", link: "#" },
      { label: "Patent Registration", link: "#" },
      { label: "Design Registration", link: "#" },
    ],
  },
  {
    title: "Company Address",
    items: [
      { label: "16107 Kensington Dr. #194, Sugar Land, TX 77479", link: "#" },
    ],
  },
];

interface FooterListItemsProps {
  label: string;
  link: string;
}

interface FooterListProps {
  title: string;
  items: FooterListItemsProps[];
}

const Footer = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* Footer Main Section */}
      <div className="flex flex-col md:flex-wrap md:flex-row p-4 w-full justify-around md:gap-8 md:p-16 bg-[#14212A]">
        {footerListItems.map((item, index) => (
          <FooterList key={index} title={item.title} items={item.items} />
        ))}
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-[#0093FF] text-black flex flex-col md:flex-row w-full justify-between items-center p-8">
        <div className="flex flex-col md:flex-row w-full justify-around gap-2 md:gap-8 items-center">
          <h2 className="hover:underline cursor-pointer">Terms & Conditions</h2>
          <h2 className="hover:underline cursor-pointer">Refund Policy</h2>
          <h2 className="hover:underline cursor-pointer">Privacy Policy</h2>
          <NavLink to={'/portal/dashboard'}>
          <h2 className="hover:underline cursor-pointer">Portal</h2>
          </NavLink>
        </div>
        <div className="flex w-full md:w-1/3 justify-between md:gap-8 md:mt-0 mt-2 items-center flex-col md:flex-row">
          <h2>Contact:</h2>
          <h2 className="font-bold whitespace-nowrap">info@lsptax.com</h2>
          <h2 className="hidden md:block">|</h2>
          <h2 className="font-bold whitespace-nowrap">+1-833-577-8291</h2>
        </div>
      </div>
    </div>
  );
};

const FooterList: React.FC<FooterListProps> = ({ title, items }) => {
  return (
    <div className="flex flex-col text-white">
      <h1 className="font-bold py-4 text-[#0093FF]">{title}</h1>
      <div className="flex flex-col gap-2 py-2">
        {items.map((list, index) => (
          <a
            key={index}
            href={list.link}
            className="hover:text-[#E84F5A] transition-colors"
          >
            {list.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Footer;
