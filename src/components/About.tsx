import aboutImage from "@/assets/about/about.svg";
import checkboxIcon from "@/assets/icons/checkbox.svg";

const points = [
  { title: "Unlock Significant Savings on Your Property Taxes" },
  { title: "Achieve Fair and Accurate Property Tax Assessments" },
  { title: "Maximize Your Savings with Expert Tax Protests" },
  { title: "Realize Substantial Property Tax Savings" },
];

const About = () => {
  return (
    <div className="flex flex-col md:flex-row h-auto py-8" id="about">
      {/* Left Section - Image */}
      <div className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0">
        <img src={aboutImage} alt="About Us" className="w-full max-w-[500px]" />
      </div>

      {/* Right Section - Text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4">
        <h2 className="border-l-4 border-blue-400 px-4 text-xl md:text-2xl">
          About Us
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold my-4">
          Lone Star Property Tax
        </h1>
        <p className="text-sm md:text-base py-2 md:w-3/4">
          At Lone Star Property Tax, we help property owners achieve fair tax
          rates through expert assessment reviews and reduction strategies. With
          deep knowledge of Texas property tax law, we identify inaccuracies,
          negotiate reductions, and offer a “No Savings, No Fee” guarantee for a
          risk-free experience.
        </p>

        {/* Points */}
        {points.map((item, index) => (
          <div key={index} className="flex items-center py-2">
            <img src={checkboxIcon} className="w-6 h-6 mr-4" alt="Checkbox" />
            <h2 className="text-sm md:text-base">{item.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
