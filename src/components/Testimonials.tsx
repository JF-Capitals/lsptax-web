import React, { useState } from "react";
import avatar from "@/assets/icons/avatar.svg";

interface TestimonialItemProps {
  avatar: string;
  starRating: number;
  comment: string;
}

interface TestimonialButtonProps {
  name: string;
  position: string;
  onClick: () => void;
  isActive: boolean;
}

const testimonials = [
  {
    avatar: avatar,
    starRating: 4,
    comment:
      "“Excellent service! They took care of everything, and we saw real savings on our property taxes. Worth every penny!”",
  },
  {
    avatar: avatar,
    starRating: 5,
    comment:
      "“Fantastic! I’m thrilled with their professional service and the significant savings we achieved!”",
  },
  {
    avatar: avatar,
    starRating: 3,
    comment:
      "“They made the entire process simple and stress-free. Highly recommended for property tax services.”",
  },
];

const testimonialButtons = [
  {
    name: "Robert Downey",
    position: "Chairman, Downer Group of Companies",
  },
  {
    name: "Joel Rogan",
    position: "Chairman, Roganr Group of Companies",
  },
  {
    name: "Sudhir Budhaa",
    position: "MD, Sudhirr Hero",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Default to the first testimonial

  return (
    <div className="bg-[#F7FAFF] flex flex-col justify-center items-center p-8 m-4">
      {/* Render the active testimonial */}
      <div className="w-full max-w-lg">
        <TestimonialItem
          avatar={testimonials[activeIndex].avatar}
          starRating={testimonials[activeIndex].starRating}
          comment={testimonials[activeIndex].comment}
        />
      </div>

      {/* Render the buttons */}
      <div
        className="flex flex-wrap justify-center gap-4 m-8"
        data-aos="fade-up"
      >
        {testimonialButtons.map((item, index) => (
          <TestimonialButton
            key={index}
            name={item.name}
            position={item.position}
            onClick={() => setActiveIndex(index)} // Update active index on click
            isActive={activeIndex === index} // Highlight the active button
          />
        ))}
      </div>
    </div>
  );
};

const TestimonialItem: React.FC<TestimonialItemProps> = ({
  avatar,
  starRating,
  comment,
}) => {
  return (
    <div className="flex flex-col justify-center items-center m-8 p-4">
      <img
        src={avatar}
        alt="avatar"
        className="w-24 h-24 rounded-full border-2 border-blue-500 mb-4"
      />
      <div className="bg-white w-full p-8 shadow-lg rounded-lg">
        <StarRating rating={starRating} />
        <p className="text-2xl text-center italic" data-aos="fade-up">
          {comment}
        </p>
      </div>
    </div>
  );
};

const TestimonialButton: React.FC<TestimonialButtonProps> = ({
  name,
  position,
  onClick,
  isActive,
}) => {
  return (
    <div
      onClick={onClick} // Trigger the click handler
      className={`p-4 w-64 text-center cursor-pointer transition-all duration-300 rounded-xl ${
        isActive
          ? "bg-blue-500 text-white"
          : "bg-[#0093FF1A] hover:bg-blue-500 hover:text-white"
      }`}
      data-aos="flip-right"
    >
      <h2 className="text-lg font-semibold">{name}</h2>
      <h3 className="text-sm">{position}</h3>
    </div>
  );
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const maxStars = 5;

  return (
    <div className="flex justify-center mb-4">
      {[...Array(maxStars)].map((_, index) => (
        <span
          key={index}
          className={`text-2xl ${
            index < rating ? "text-blue-500" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Testimonials;
