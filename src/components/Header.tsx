import logo from "@/assets/logo.svg";
import phoneLogo from "@/assets/icons/phone.svg";
const Header = () => {
  return (
    <div className="flex justify-around items-center  p-4">
      <img src={logo} />
      <a
        href="#about"
        className="p-2 hover:text-white  text-xl cursor-pointer relative before:rounded-xl before:absolute before:bg-blue-400 before:bottom-0 before:left-0 before:h-full before:w-full before:origin-bottom before:scale-y-[0.1] hover:before:scale-y-100 before:transition-transform before:ease-in-out before:duration-500"
      >
        <span className="relative"> About Us</span>
      </a>
      <a
        href="#whyus"
        className="p-2 hover:text-white  text-xl cursor-pointer relative before:rounded-xl before:absolute before:bg-blue-400 before:bottom-0 before:left-0 before:h-full before:w-full before:origin-bottom before:scale-y-[0.1] hover:before:scale-y-100 before:transition-transform before:ease-in-out before:duration-500"
      >
        <span className="relative"> Why Us</span>
      </a>
      <a
        href="#how"
        className="p-2 hover:text-white  text-xl cursor-pointer relative before:rounded-xl before:absolute before:bg-blue-400 before:bottom-0 before:left-0 before:h-full before:w-full before:origin-bottom before:scale-y-[0.1] hover:before:scale-y-100 before:transition-transform before:ease-in-out before:duration-500"
      >
        <span className="relative"> How it works</span>
      </a>
      {/* <a
        href="#faq"
        className="p-2 hover:text-white  text-xl cursor-pointer relative before:rounded-xl before:absolute before:bg-blue-400 before:bottom-0 before:left-0 before:h-full before:w-full before:origin-bottom before:scale-y-[0.1] hover:before:scale-y-100 before:transition-transform before:ease-in-out before:duration-500"
      >
        <span className="relative"> FAQs</span>
      </a> */}
      <a
        href="#keydates"
        className="p-2 hover:text-white  text-xl cursor-pointer relative before:rounded-xl before:absolute before:bg-blue-400 before:bottom-0 before:left-0 before:h-full before:w-full before:origin-bottom before:scale-y-[0.1] hover:before:scale-y-100 before:transition-transform before:ease-in-out before:duration-500"
      >
        <span className="relative"> Key Dates</span>
      </a>
      <a className="bg-[#E84F5A] text-white p-4 px-8 border rounded-full flex gap-2 cursor-pointer group">
        <img src={phoneLogo} alt="" className="group-hover:animate-vibrate" />
        Call Now
      </a>
    </div>
  );
};

export default Header;
