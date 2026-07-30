import React from "react";
// import logo1 from src/assets/TimeLineLogo/logo1.png";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timelineImage from "../../../../assets/Images/timeline.png";

const timeline = [
  {
    Logo: Logo1,
    heading: "Learn at your own pace",
    Description: "StudyNotion",
  },
  {
    Logo: Logo2,
    heading: "Learn at your own pace",
    Description: "StudyNotion",
  },
  {
    Logo: Logo3,
    heading: "Learn at your own pace",
    Description: "StudyNotion",
  },
  {
    Logo: Logo4,
    heading: "Learn at your own pace",
    Description: "StudyNotion",
  },
];

const TimelineSection = () => {
  return (
    <div>
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-row items-center justify-between gap-15">

        {/* Left Section */}
        <div className="flex flex-col gap-5">
          {timeline.map((element, index) => {
            return (
              <div
                className="flex flex-row gap-5"
                key={index}
              >
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white">
                  <img
                    src={element.Logo}
                    alt="logo"
                    className="w-6 h-6"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {element.heading}
                  </h2>

                  <p className="text-base text-gray-600">
                    {element.Description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Section photo */}
        <div className=" relative shadow-blue-200 ">
            <img src={timelineImage} alt="timeline" className="shadow-white object-cover h-fit" />
             
               <div className="absolute    bg-caribbeangreen-700   flex flex-row text-white uppercase py-6
               left-[50%] translate-x-[-50%] bottom-[-10%]   shadow-lg shadow-caribbeangreen-200">
               

               <div className="flex flex-row items-center   gap-5 border-r border-caribbeangreen-300 px-7">
                <p className="text-3xl font-bold">10</p>
                <p className="text-caribbeangreen-300 text-sm">Years of Experience</p>

               </div>
               <div className = "flex gap-5 items-center px-7">
                 <p className="text-3xl font-bold">250</p>
                <p className="text-caribbeangreen-300 text-sm">Types of Courses</p>
               </div>


               </div>

                

        </div>
         
      </div>
    </div>
  );
};

 export default TimelineSection;