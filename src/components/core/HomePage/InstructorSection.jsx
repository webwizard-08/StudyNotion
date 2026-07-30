import React from "react";
import Instructor from "../../../assets/Images/Instructor.png";
import HighlightedText from "./HighlightedText";
import CTAButton from "../HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
const InstructorSection = () => {
  return (
    <div className="mt-14">
        <div className="flex flex-row gap-20 items-center ">
          <div className=" w-[50%]">
              <img  src={Instructor} 
              alt="Instructor" 
              className="shadow-white"/>
          </div>
          <div className="flex flex-col gap-5 w-[50%]">
             
             <div className="text-4xl font-semibold w-[50%]">
                Become an 
            <HighlightedText text={" instructors"} />
             </div>
             <p className="text-richblack-300 w-[80%] text-[16px] font-medium">
               Join our community of expert instructors and start sharing your knowledge today.
             </p>
              <div className="w-fit">
                <CTAButton active={true} link={"/signup"}>
                <div className="flex items-center gap-2">
                Start Teaching Today
                <FaArrowRight />
                
                </div>
                </CTAButton>
              </div>

          </div>
        </div>
    </div>
  )}
  export default InstructorSection;