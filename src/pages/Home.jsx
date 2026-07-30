import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import HighlightedText from "../components/core/HomePage/HighlightedText";
import CTAButton from "../components/core/HomePage/Button";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import ReviewSlider from "../components/core/HomePage/common/ReviewSlider";
import Banner from "../assets/Images/banner.mp4";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import IntructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/core/HomePage/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import CourseCard from "../components/core/HomePage/CourseCard";
const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">

        {/* Become Instructor Button */}
        <Link to="/signup">
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Heading */}
        <div className="text-center text-4xl font-semibold">
          Empower Your Future with{" "}
          <HighlightedText text={"Coding Skills"} />
        </div>

        {/* Sub Heading */}
        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace,
          from anywhere in the world, and get access to a wealth of
          resources, including hands-on projects, quizzes, and personalized
          feedback from instructors.
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} link={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} link={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* Video */}
        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            autoPlay
            loop
            playsInline
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

       {/* Code Section 1 */}
<div className="">
  <CodeBlocks
    position={"lg:flex-row"}
    heading={
      <div className="text-4xl font-semibold">
        Unlock your{" "}
        <HighlightedText text={"coding potential"} /> with our online
        courses.
      </div>
    }
    subheading={
      "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
    }
    ctabtn1={{
      btnText: "Try it Yourself",
      link: "/signup",
      active: true,
    }}
    ctabtn2={{
      btnText: "Learn More",
      link: "/signup",
      active: false,
    }}
    codeColor={"text-yellow-25"}
    codeblock={`<!DOCTYPE html>
<html lang="en">
<head>
<title>This is my Page</title>
</head>
 >
<nav>
 
</nav>
</body>
</html>`}
    backgroundGradient={<div className="codeblock1 absolute"></div>}
  />
</div>

{/* Code Section 2 */}
<div>
  <CodeBlocks
    position={"lg:flex-row-reverse"}
    heading={
      <div className="w-full text-4xl font-semibold lg:w-[50%]">
        Start <HighlightedText text={"coding in seconds"} />
      </div>
    }
    subheading={
      "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
    }
    ctabtn1={{
      btnText: "Continue Lesson",
      link: "/signup",
      active: true,
    }}
    ctabtn2={{
      btnText: "Learn More",
      link: "/signup",
      active: false,
    }}
    codeColor={"text-white"}
    codeblock={`import React from "react";

import CTAButton from "./Button";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";

 

export default Home;`}
    backgroundGradient={<div className="codeblock2 absolute"></div>}
  />
</div>

        {/* Explore Section */}
        <ExploreMore /> 
       
        {/* <ExploreMore /> */}

      </div>

{/* section2 */}
   <div className="bg-pure-greys-5 text-richblack-700 ">

    <div className = "homepage_bg h-[333px] ">
      <div className=" flex  mx-auto w-11/12 max-w-maxContent items-center justify-center gap-5  flex-col">
    <div className="h-[220px]"></div>
        
         <div className="flex flex-row gap-7 text-white items-center">
          <CTAButton active={true} link={"/signup"}>
          <div className="flex items-center gap-2">
              Explore full catalog
            <FaArrowRight />
          </div>
          </CTAButton>
           

          <CTAButton active={false} link={"/login"}>
           <div className="flex items-center gap-2">
              Learn More
             
          </div>
          </CTAButton>


        </div>


    </div>
</div>
  

  <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-7">
   
   <div className="flex flex-row gap-5 mb-10 mt-[90px]">
    <div className="text-4xl font-semibold text-richblack-900 w-[45%]">
      Get the skills you need for a 
      <HighlightedText text={"job that is in demand"} />
    </div>

     <div className="flex flex-col gap-10 w-[40%] items-start">
    <div className="text-[16px]">
      The Modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.

    </div>
    <CTAButton active={true} link={"/signup"}>
      <div>
              Learn More
  
          </div>
    </CTAButton>

   </div>

   </div>

   

  </div>
  

  <TimelineSection />

  <LearningLanguageSection />

</div>

{/* section 3 */}

<div className="w-11/12 mx-auto max-w-maxContent bg-richblack-900 text-white">
  <IntructorSection />

  <h2 className="text-4xl font-semibold text-center mt-10">
    Reviews From Other Learners
  </h2>

  <ReviewSlider />
</div>

<Footer />
{/* section 4 */}

 


</div>


    

   

    
  );
};

export default Home;

