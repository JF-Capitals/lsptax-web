
import { NavLink } from "react-router-dom";

// const footerListItems = [
//   {
//     title: "Company Registration",
//     items: [
//       { label: "Private Limited", link: "#" },
//       { label: "Public Limited", link: "#" },
//       { label: "Private Limited", link: "#" },
//       { label: "Private Limited", link: "#" },
//     ],
//   },
//   {
//     title: "Licences & Registrations",
//     items: [
//       { label: "GST Registration", link: "#" },
//       { label: "MSME Registration", link: "#" },
//       { label: "FSSAI Registration", link: "#" },
//       { label: "ISO Registration", link: "#" },
//     ],
//   },
//   {
//     title: "Intellectual Property Rights",
//     items: [
//       { label: "Trademark Registration", link: "#" },
//       { label: "Copyright Registration", link: "#" },
//       { label: "Patent Registration", link: "#" },
//       { label: "Design Registration", link: "#" },
//     ],
//   },
//   {
//     title: "Company Address",
//     items: [
//       { label: "16107 Kensington Dr. #194, Sugar Land, TX 77479", link: "#" },
//     ],
//   },
// ];

// interface FooterListItemsProps {
//   label: string;
//   link: string;
// }

// interface FooterListProps {
//   title: string;
//   items: FooterListItemsProps[];
// }

const Footer = () => {
  return (
    <footer className="bg-[#14212A] text-[#0093FF] py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Office Address */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold">Registered Office:</h3>
            <p className="hover:text-blue-400 cursor-pointer transition-colors">
              16107 Kensington Dr. #194,
              <br />
              Sugar Land, TX 77479
            </p>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold">Contact Us:</h3>
            <div className="space-y-1">
              <p className="hover:text-blue-400 transition-colors">
                <a href="mailto:info@lsptax.com">info@lsptax.com</a>
              </p>
              <p className="hover:text-blue-400 transition-colors">
                <a href="tel:+18335778291">+1-833-577-8291</a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold">Quick Links:</h3>
            <NavLink
              to="/portal/dashboard"
              className="hover:text-blue-400 transition-colors"
            >
              Portal
            </NavLink>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="mt-8 pt-4 border-t border-blue-900/30 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Lone Star Property Tax. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// const FooterList: React.FC<FooterListProps> = ({ title, items }) => {
//   return (
//     <div className="flex flex-col text-white">
//       <h1 className="font-bold py-4 text-[#0093FF]">{title}</h1>
//       <div className="flex flex-col gap-2 py-2">
//         {items.map((list, index) => (
//           <a
//             key={index}
//             href={list.link}
//             className="hover:text-[#E84F5A] transition-colors"
//           >
//             {list.label}
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// };

export default Footer;
