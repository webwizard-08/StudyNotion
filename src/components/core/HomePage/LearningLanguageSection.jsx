import React from "react";
import HighlightedText from "./HighlightedText";
import know_your_progress from "../../../assets/Images/Know_your_progress.png";
import compare_with_others from "../../../assets/Images/Compare_with_others.png";
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png";
import CTAButton from "../HomePage/Button";
const LearningLanguageSection = () => {
    return (
         <div className="mt-[130px]">
            <div className="flex flex-col gap-5 items-center">
            <div className="text-4xl font-semibold   text-center">
                Your Swiss Knife for  
                <HighlightedText text={"Learn any language"} />  
            </div>
            <div className="text-center  mx-auto text-richblack-600 text-base mt-3 font-medium w-[70%]">
           Using spin making learning languages fun and engaging. Our platform offers a wide range of interactive l
            </div>

            <div className="flex flex-row  items-center justify-center  mt-5">
             <img src={know_your_progress} alt="know_your_progress" className=" object-contain w-[30%] h-[30%] "/>
             <img src={compare_with_others} alt="compare_with_others" className=" object-contain w-[30%] h-[30%]"/>
             <img src={plan_your_lesson} alt="plan_your_lesson" className="object-contain w-[30%] h-[30%]"/>
            </div>

            <div>

            </div>
              <div className="w-fit mb-32">
                 <CTAButton
               active={true} link={"/signup"}>
                <div>
                Learn More
                </div>  
              
              </CTAButton>
              </div>
            </div>
         </div>
    );
};

export default LearningLanguageSection;
