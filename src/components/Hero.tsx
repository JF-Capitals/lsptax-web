import heroImage from "@/assets/hero.svg";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div
      id="hero"
      className="bg-[#F7FAFF] flex flex-col md:flex-row items-center relative p-8 md:p-18 pb-32 z-1"
    >
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col items-start md:ml-32 mb-8 md:mb-0">
        <div>
          <h4 className="border-l-4 border-blue-400 px-4 text-lg md:text-xl">
            Offering the best tax reduction services
          </h4>
          <h1 className="text-4xl md:text-6xl font-bold my-4">
            Maximize Your
            <br /> Property Tax Savings
          </h1>
          <h3 className="text-lg md:text-xl">
            Trusted Professionals Committed To Reducing
            <br /> Your Property Tax Burden - No Savings, No Fees!
          </h3>
        </div>
        <div className="flex gap-4 mt-8">
          <button className="flex items-center bg-blue-400 text-white p-2 md:px-8 rounded mb-4 md:mb-0 h-16 group">
            Get Started Now
            <ArrowRight
              className="ml-4 transform transition-transform group-hover:translate-x-2"
              size={18}
            />
          </button>
          <button className="flex items-center bg-black text-white p-2 md:px-8 rounded h-16 group">
            Learn More
            <ArrowRight
              className="ml-4 transform transition-transform group-hover:translate-x-2"
              size={18}
            />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex justify-center md:mr-16 shadow-lg h-full md:h-1/2 rounded-full">
        <img
          src={heroImage}
          alt="Hero Image"
          className="relative z-10 w-full max-w-md md:max-w-full rounded-full "
        />
      </div>
    </div>
  );
};

export default Hero;
