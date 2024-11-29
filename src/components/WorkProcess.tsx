import w1 from "@/assets/work/w1.svg";
import w2 from "@/assets/work/w2.svg";
import w3 from "@/assets/work/w3.svg";

const workProcessCopy = [
  {
    image: w1,
    title: "We submit your protest",
    desc: "We handle your property tax protest from start to finish, ensuring all paperwork is filed accurately and on time for a better chance at reduction.",
    color: "#0056B3",
  },
  {
    image: w2,
    title: "We gather the evidence",
    desc: "We collect key evidence like market trends and property data to build a strong case for lowering your taxes.",
    color: "#FFD700",
  },
  {
    image: w3,
    title: "We fight your case",
    desc: "We negotiate with tax authorities on your behalf to secure a fair property tax reduction.",
    color: "#FF4500",
  },
];

const WorkProcess = () => {
  return (
    <div
      id="how"
      className="bg-blue-50 bg-opacity-90 h-screen flex items-center justify-center flex-col text-white relative p-8  mt-8"
    >
      <h2 className="text-[#02A6DC] md:my-4 relative font-bold text-lg">
        Work Process
      </h2>
      <h1 className="text-4xl text-black my-4 relative font-bold">
        How it Works
      </h1>
      <div className="flex flex-col md:gap-12 my-4 ">
        {workProcessCopy.map((item, index) => (
          <div
            data-aos="fade-left"
            key={index}
            className="border border-white rounded-full flex items-center md:p-8 md:px-16 md:gap-8 p-4 px-4 shadow-md my-4"
            style={{ backgroundColor: item.color }} // Dynamically set the background color
          >
            <h2 className="md:text-8xl text-4xl font-bold">{index + 1}.</h2>
            <div className="flex flex-col md:gap-4 m-4">
              <h2 className="md:text-2xl text-lg ">{item.title}</h2>
              <p className="text-xs">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <img
        src={circleImage}
        className="md:block absolute bottom-0 left-0 w-24 md:w-64 md:w-auto z-0 hidden"
        alt="Circle Decoration"
      /> */}
    </div>
  );
};

export default WorkProcess;
