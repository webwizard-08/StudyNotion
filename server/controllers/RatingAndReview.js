

const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { mongo, default: mongoose } = require("mongoose");

//createRating
exports.createRating = async (req, res) => {
    try{

        //get user id
        const userId = req.user.id;
        //fetchdata from req body
        const {rating, review, courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
                                    {_id:courseId,
                                    studentsEnrolled: {$elemMatch: {$eq: userId} },
                                });

        if(!courseDetails) {
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            });
        }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                user:userId,
                                                course:courseId,
                                            });
        if(alreadyReviewed) {
                    return res.status(403).json({
                        success:false,
                        message:'Course is already reviewed by the user',
                    });
                }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
                                        rating, review, 
                                        course:courseId,
                                        user:userId,
                                    });
       
        //update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                    {
                                        $push: {
                                            ratingAndReviews: ratingReview._id,
                                        }
                                    },
                                    {new: true});
        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}



//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await RatingAndReview.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}


// const RatingAndReview = require('../models/RatingAndReview');
// const Course = require('../models/Course');
// const User = require('../models/User');
// //create a new rating and review for a course
// exports.createRatingAndReview = async (req, res) => {
//     try {
//         //get courseId and userId from req.body
//        const userId = req.user.id;
//        const {courseId, rating, review} = req.body;

//         //rating and review are required from the user request body

//         //check if the user has already submitted a rating and review for the course
//         const courseDetails = await Course.findOne(
//             { _id: courseId ,
//             studentsEnrolled: { $elemMatch: { $eq: userId }}
//          }
        
//         );
//         //check if the course exists or not
//         if(!courseDetails){
//             return res.status(404).json({
//                 success: false,
//                 message: "Course not found or user not enrolled in the course"
//             });
//         }
//         //check already reviewed or not
//         const alreadyReviewed = await RatingAndReview.findOne({

//             user: userId,
//             course: courseId
//         });
//         //if already reviewed then return error
//         if(alreadyReviewed){
//             return res.status(400).json({
//                 success: false,
//                 message: "User has already submitted a rating and review for this course"
//             });
//         }
//           //create a  rating and review for the course
//           const ratingReview = await RatingAndReview.create({
//             rating , review,
//             user: userId,
//             course: courseId,
             
//           });
//           //update the course with the new rating and review
//         const updatedCourseDetails = await Course.findByIdAndUpdate({_id: courseId}, {
//             $push: { ratingAndReviews: ratingReview._id }
//           }, { new: true });    

//           console.log("Updated course details: ", updatedCourseDetails);
//                      //return the success response to the user
//             return res.status(200).json({
//                 success: true,
//                 message: "Rating and review submitted successfully",
//                 data: ratingReview
//             }); 

//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).json({  
//         message: 'Server Error' });
//     }
// }
// //get average rating and reviews for a course
// exports.getAverageRating = async (req, res) => {
//     try {
//         ///get courseId from req.body
//         const courseId = req.body.courseId;
//         //validate the courseId
//         if(!courseId){
//             return res.status(400).json({   
//                 success: false,
//                 message: "Course ID is required"
//             });
//         }
//         //get the average rating and reviews for the course
//         const averageRating = await RatingAndReview.aggregate([
//             {
//                  $match: {
//                     //match the courseId with the course field in the RatingAndReview model convert courseId to ObjectId
//                     course: new mongoose.Types.ObjectId(courseId)
//                  },
//                  },
//             { //group the ratings and reviews by courseId and calculate the average rating
//                 $group: { 
//                     _id: null, 
//                     averageRating:  { $avg: "$rating" }
//                      } 
//             }
//         ]);
//         //return the average rating to the user
//         return res.status(200).json({
//             success: true,
//             message: "Average rating retrieved successfully",
//             data: averageRating[0] ? averageRating[0].averageRating : 0
//         });

//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).json({  
//         message: 'Server Error' });
//     }   
// }

// //get all rating and reviews for a course populate the user details in the response
// exports.getAllRating = async (req, res) => {
//     try{
//         //retrive all rating and reviews for a course from the database and sort them by rating in descending order
//         const allReviews = await RatingAndReview.find({})
//         .sort({ rating: "desc" })
//         .populate({
//             path: "user",
//             select: "firstName lastName email image",
//         })
//         .populate({
//             path: "course",
//             select: "courseName",
//         }).exec();

//         // return the success response to the user
//         return res.status(200).json({
//             success: true,
//             message: "All rating and reviews retrieved successfully",
//             data: allReviews
//         });

//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).json({  
//         message: 'Server Error' });
//     }   
    
// }
    
    
    
    
    
    
    
    
    
    
    
    
    
//      //all rating and reviews for a course
      