import circleImage from "@/assets/work/circle.svg";
import mainWorkImage from "@/assets/work/main.svg";

const WorkProcess = () => {
  return (
    <div
      id="how"
      className="bg-[#14212A] h-screen flex items-center flex-col text-white relative"
    >
      <h2 className="text-blue-600 my-4 relative z-10">Work Process</h2>
      <h1 className="text-4xl text-white my-4 relative z-10">How it Works</h1>
      <div className="p-8 mt-8 flex flex-col items-center relative z-10">
        <div className="flex justify-center mb-8">
          <img
            src={mainWorkImage}
            alt="Main Work Process"
            className="max-w-full h-auto"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full relative z-10">
          <div className="w-full max-w-xs">
            <h2 className="text-lg font-semibold">We submit your protest</h2>
            <p className="text-xs">
              We take the hassle out of the property tax protest process by
              managing everything from start to finish. Our team carefully
              reviews your assessment, identifies potential inaccuracies, and
              files a formal protest on your behalf. By handling all paperwork
              and deadlines, we ensure your protest is submitted correctly and
              on time, maximizing your chance for a successful tax reduction.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <h2 className="text-lg font-semibold">We gather the evidence</h2>
            <p className="text-xs">
              Our team collects all necessary evidence to support your tax
              protest, including comparable property data, market trends, and
              valuation discrepancies. This thorough approach strengthens your
              case, providing compelling proof to challenge over-assessments and
              achieve the best possible reduction.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <h2 className="text-lg font-semibold">We fight your case</h2>
            <p className="text-xs">
              We advocate vigorously on your behalf, presenting evidence and
              negotiating directly with tax authorities to ensure a fair
              reduction. Our expertise and dedication drive us to secure the
              best possible outcome, so you pay only what’s fair on your
              property taxes.
            </p>
          </div>
        </div>
      </div>
      <img
        src={circleImage}
        className="absolute bottom-0 left-0 w- md:w-auto z-0"
        alt="Circle Decoration"
      />
    </div>
  );
};

export default WorkProcess;
