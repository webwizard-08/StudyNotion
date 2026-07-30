const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")

const Course = require("../models/Course")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")
// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body
    const id = req.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
    const profile = await Profile.findById(userDetails.additionalDetails)

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    await user.save()

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender

    // Save the updated profile
    await profile.save()

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    console.log(id)
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    })
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      )
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id })
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userId: id })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
  }
}

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    console.log(userDetails)
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    
    console.log("Files:", req.files);
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
  console.error("UPDATE PROFILE PIC ERROR:", error);
  return res.status(500).json({
    success: false,
    message: error.message,
  });
}
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    console.log("User ID:", req.user.id);

    const courseDetails = await Course.find({
      instructor: req.user.id,
    });

    console.log("Course Details:", courseDetails);

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated =
        totalStudentsEnrolled * course.price;

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// const  User = require("../models/User");
// const  Profile = require("../models/Profile");
// const  { uploadImageToCloudinary } = require("../utils/emageUploader");


// //update profile handler function
// exports.updateProfile = async (req, res) => {
//     try {
//         //fetch data from req.body
//         const { about="", contactNumber, gender, dateOfBirth="" } = req.body;
//         //get userId from req.user
//         const id = req.user.id;
//         //validation of data
//         if (!contactNumber || !gender || !id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }
//         //find user by userId and update profile
//         const userDetails = await User.findById(id);
//         const profileId = userDetails.additionalDetails;
//         const profileDetails = await Profile.findById(profileId);
         
//         //update profile with new data
//         profileDetails.about = about;
//         profileDetails.contactNumber = contactNumber;
//         profileDetails.gender = gender;
//         profileDetails.dateOfBirth = dateOfBirth;
//         //update profile in db
//         await profileDetails.save();    
//         //return success response
//         return res.status(200).json({
//             success: true,
//             message: "Profile updated successfully"
//         });
//     }
//     catch (error) {
//         console.error("Error in updateProfile: ", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }   
// }

// // delete Account handler function
// exports.deleteAccount = async (req, res) => {
//     try {
//         //get userId from req.user
//         const id = req.user.id;
//         //validation of data
         
//         //get profileId from user details
//         const userDetails = await User.findById(id);
//         if (!userDetails) {
//             return res.status(404).json({
//                 success: false, 
//                 message: "User not found"
//             });
//         }
         
//         //delete profile from db
//         await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
//         //delete user from db
//         await User.findByIdAndDelete({_id:id});

//         // unrolled useruser from all all enrolled courses and remove user from all enrolled courses
//         // const enrolledCourses = userDetails.enrolledCourses;
//         // for (const courseId of enrolledCourses) {   
//         //     const courseDetails = await Course.findById(courseId);
//         //     if (courseDetails) {
//         //         courseDetails.studentsEnrolled.pull(id);
//         //         await courseDetails.save();
//         //     }
//         // }

//         //return success response
//         return res.status(200).json({
//             success: true,
//             message: "Account deleted successfully"
//         });


//     }  
    
//     catch (error) {
//         console.error("Error in deleteAccount: ", error);
//         return res.status(500).json({   
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }

// //get user profile handler function
// exports.getallUserDetails = async (req, res) => {
//     try {
//         //get userId from req.user
//         const id = req.user.id;
        
        
//         //get user details from db
//         const userDetails = await User.findById(id).populate("additionalDetails").exec();
//         if (!userDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }
//         //return user details
//         return res.status(200).json({
//             success: true,
//             data: userDetails,
//             message: "User details fetched successfully"
//         });
//     }
//     catch (error) {
//         console.error("Error in getallUserDetails : ", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }
