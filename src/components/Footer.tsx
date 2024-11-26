import React from "react";

const footerListItems = [
  {
    title: "Company Registration",
    items: [
      {
        label: "Private Limited",
        link: "",
      },
      {
        label: "Public Limited",
        link: "",
      },
      {
        label: "Private Limited",
        link: "",
      },
      {
        label: "Private Limited",
        link: "",
      },
    ],
  },
  {
    title: "Licences & Registrations",
    items: [
      {
        label: "GST Registration",
        link: "",
      },
      {
        label: "MSME Registration",
        link: "",
      },
      {
        label: "FSSAI Registration",
        link: "",
      },
      {
        label: "ISO Registration",
        link: "",
      },
    ],
  },
  {
    title: "Intellectual Propert Rights",
    items: [
      {
        label: "Trademark Registration",
        link: "",
      },
      {
        label: "Copyright Registration",
        link: "",
      },
      {
        label: "Patent Registration",
        link: "",
      },
      {
        label: "Design Registration",
        link: "",
      },
    ],
  },
  {
    title: "Company Registration",
    items: [
      {
        label: "16107 Kensington Dr. #194, Sugar Land, TX 77479",
        link: "",
      },
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
      <div className="flex w-full justify-around gap-4 p-16 bg-[#14212A]">
        {footerListItems.map((item) => (
          <FooterList title={item.title} items={item.items} />
        ))}
      </div>
      <div className="bg-blue-500 text-black flex w-full justify-between p-8">
        <div className="flex w-full justify-around">
          <h2>Terms & Conditions </h2>
          <h2>Refund Policy</h2>
          <h2>Privacy Policy</h2>
          <h2>Sitemap</h2>
        </div>
        <div className="flex w-1/2 gap-8">
          <h2>Contact:</h2>
          <h2>info@lsptax.com </h2>
          <h2>|</h2>
          <h2>+1-833-577-8291</h2>
        </div>
      </div>
    </div>
  );
};

const FooterList: React.FC<FooterListProps> = ({ title, items }) => {
  return (
    <div className="flex flex-col text-white">
      <h1 className="font-bold py-4 text-[#E84F5A]">{title}</h1>
      <div className="flex flex-col py-2">
        {items.map((list) => (
          <a href={list.link}>{list.label}</a>
        ))}
      </div>
    </div>
  );
};

export default Footer;


