import React from "react";
import CTAButton from "../HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) => {
  return (
    <div
      className={`flex ${position} my-10 justify-between gap-10 items-center`}
    >
      {/* Left Section */}
      <div className="flex w-[100%] flex-col gap-8 lg:w-[50%]">
        {heading}

        <div className="text-[16px] font-bold text-richblack-300">
          {subheading}
        </div>

        <div className="mt-7 flex gap-7">
          <CTAButton active={ctabtn1.active} link={ctabtn1.link}>
            <div className="flex items-center gap-2">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>

          <CTAButton active={ctabtn2.active} link={ctabtn2.link}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative flex min-h-[320px] w-[100%] flex-row py-4 lg:w-[50%]">
        {backgroundGradient}

        {/* Line Numbers */}
        <div className="flex w-[10%] flex-col text-center font-inter font-bold leading-7 text-richblack-400">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        {/* Code */}
        <div
          className={`w-[90%] flex flex-col gap-2 font-mono font-bold leading-7 ${codeColor} pr-2`}
        >
          <TypeAnimation
            sequence={[codeblock, 1000, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            style={{
              whiteSpace: "pre-wrap",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;