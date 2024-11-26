import aboutImage from "@/assets/about/about.svg";
import checkboxIcon from "@/assets/icons/checkbox.svg"

const points = [
  {
    title: "Unlock Significant Savings on Your Property Taxes",
  },
  { title: "Achieve Fair and Accurate Property Tax Assessments" },
  {
    title: "Maximize Your Savings with Expert Tax Protests",
  },
  { title: "Realize Substantial Property Tax Savings" },
];

const About = () => {
  return (
    <div className="flex h-screen" id="about">
      <div className="w-1/2 flex items-center align-center justify-center">
        <img src={aboutImage} alt="" />
      </div>
      <div className="w-1/2 flex justify-center flex-col">
        <h2 className="border-l-4 border-blue-400 px-4">About Us</h2>
        <h1 className="text-4xl my-8">Lone Star Property Tax</h1>
        <p className="w-1/2 py-2">
          At Lone Star Property Tax, we help property owners achieve fair tax
          rates through expert assessment reviews and reduction strategies. With
          deep knowledge of Texas property tax law, we identify inaccuracies,
          negotiate reductions, and offer a “No Savings, No Fee” guarantee for a
          risk-free experience.
        </p>
        {points.map((item) => {
          return (
            <>
              <div className="flex py-2">
                <img src={checkboxIcon} className="w-6 h-6 mr-4" alt="" />
                <h2>{item.title}</h2>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default About;
