import circleImage from "@/assets/work/circle.svg"
import mainWorkImage from "@/assets/work/main.svg"

const WorkProcess = () => {
  return (
    <div id="how" className="bg-[#14212A] h-screen flex items-center flex-col text-white relative ">
      <h2 className="text-blue-600 my-4">Work Process</h2>
      <h1 className="text-4xl text-white my-4 ">How it Works</h1>
      <div className="p-16 mt-8 flex flex-col">
        <div className="flex justify-between">
          <img src={mainWorkImage} alt="" />
        </div>
        <div className="flex justify-between">
          <div className="w-48">
            <h2 className="text-lg">We submit your protest</h2>
            <p className="text-xs">
              We take the hassle out of the property tax protest process by
              managing everything from start to finish. Our team carefully
              reviews your assessment, identifies potential inaccuracies, and
              files a formal protest on your behalf. By handling all paperwork
              and deadlines, we ensure your protest is submitted correctly and
              on time, maximizing your chance for a successful tax reduction.
            </p>
          </div>
          <div className="w-48">
            <h2 className="text-lg">We gather the eveidence</h2>
            <p className="text-xs">
              Our team collects all necessary evidence to support your tax
              protest, including comparable property data, market trends, and
              valuation discrepancies. This thorough approach strengthens your
              case, providing compelling proof to challenge over-assessments and
              achieve the best possible reduction.
            </p>
          </div>
          <div className="w-48">
            <h2 className="text-lg">We fight your case</h2>
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
      <img src={circleImage} className="absolute bottom-0 left-0" alt="" />
    </div>
  );
}


export default WorkProcess