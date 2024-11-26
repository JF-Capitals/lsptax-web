import heroImage from "@/assets/hero.svg";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div id="hero" className="bg-[#F7FAFF] flex items-center relative p-18 pb-32 z-1">
      {/* Left Section */}
      <div className="w-1/2 flex flex-col items-start ml-32">
        <div>
          <h4 className="border-l-4 border-blue-400 px-4">
            Offering the best tax reduction services
          </h4>
          <h1 className="text-6xl font-bold my-4">
            Maximize Your
            <br /> Property Tax Savings
          </h1>
          <h3>
            Trusted Professionals Committed To Reducing
            <br /> Your Property Tax Burden - No Savings, No Fees!
          </h3>
        </div>
        <div className="flex gap-4  mt-8">
          <button className="flex items-center bg-blue-400 text-white text-sm p-2 px-8 rounded">
            Get Started Now <ArrowRight className="ml-4" size={18} />
          </button>
          <button className="flex items-center bg-black text-white text-sm p-2 px-8 rounded">
            Learn More <ArrowRight className="ml-4" size={18} />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col items-center mr-16">
        <img src={heroImage} alt="" className="relative z-10 " />
        {/* Blue Circle */}
        {/* <div className="w-[64rem] h-[64rem] bg-blue-500 rounded-full absolute top-4 right-1000 transform translate-x-1/2 -translate-y-1/2 z-0"></div> */}
      </div>
    </div>
  );
};

export default Hero;
