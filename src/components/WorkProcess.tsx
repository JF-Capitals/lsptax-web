import circleImage from "@/assets/work/circle.svg";
import mainWorkImage from "@/assets/work/main.svg";
import w1 from "@/assets/work/w1.svg";
import w2 from "@/assets/work/w2.svg";
import w3 from "@/assets/work/w3.svg";
import { ArrowDown } from "lucide-react";

const workProcessCopy = [
  {
    image: w1,
    title: "We submit your protest",
    desc: "We handle your property tax protest from start to finish, ensuring all paperwork is filed accurately and on time for a better chance at reduction.",
  },
  {
    image: w2,
    title: "We gather the evidence",
    desc: "We collect key evidence like market trends and property data to build a strong case for lowering your taxes.",
  },
  {
    image: w3,
    title: "We fight your case",
    desc: "We negotiate with tax authorities on your behalf to secure a fair property tax reduction.",
  },
];

const WorkProcess = () => {
  return (
    <div
      id="how"
      className="bg-[#14212A] md:h-screen w-full flex items-center flex-col text-white relative px-8"
    >
      <h2 className="text-blue-600 md:my-4 relative z-10 underline decoration-white">
        Work Process
      </h2>
      <h1 className="text-4xl text-white my-4 relative z-10">How it Works</h1>
      <div className="md:p-8 md:mt-8 flex flex-col items-center relative z-10">
        <div className="flex justify-center mb-8 md:block hidden">
          <img
            src={mainWorkImage}
            alt="Main Work Process"
            className="max-w-full h-auto"
          />
        </div>
        <div className=" md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full relative z-10 hidden">
          {workProcessCopy.map((item) => (
            <div className="w-full max-w-xs border border-slate-500 rounded-full p-16 bg-[#203442]">
              <h2 className="text-2xl font-semibold py-4">{item.title}</h2>
              <p className="text-lg leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="md:hidden">
          {workProcessCopy.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="border border-slate-500 rounded-full p-16 m-8 flex flex-col items-center bg-[#203442]">
                <img src={item.image} alt="" className="w-32" />
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-xs w-64">{item.desc}</p>
              </div>
              {index !== workProcessCopy.length - 1 && <ArrowDown />}
            </div>
          ))}
        </div>
      </div>
      <img
        src={circleImage}
        className="absolute bottom-0 left-0 w-24 md:w-64 md:w-auto z-0"
        alt="Circle Decoration"
      />
    </div>
  );
};

export default WorkProcess;
