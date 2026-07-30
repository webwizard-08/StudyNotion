const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")

// Capture the payment and initiate the Razorpay order

 exports.capturePayment = async (req, res) => { const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}


// const {instance} = require('../config/razorpay');
// const Course = require('../models/Course');
// const User = require('../models/User');
// const mailSender = require('../utils/mailSender');
// const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');

// //capture the payment and enroll the user in the course
// exports.capturePayment = async (req, res) => {
//     try {   
//         //get courseId and userId from req.body 
//         const {course_id} = req.body;
//         const userId = req.user.id;
//         //validate the data
        
//         //valid courseId and userId are required
//             if (!course_id) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Course ID is required"
//                 });
//             }
//             //valid course details are required
//             let course;
//             try{
//                 course = await Course.findById(course_id);
//                 if(!course){
//                     return res.status(404).json({
//                         success: false,
//                         message: "Course not found"
//                     });
//                 }
//             }
//             catch (error) {
//                 console.error("Error while fetching course details: ", error);
//                 return res.status(500).json({
//                     success: false,
//                     message: "Error while fetching course details"
//                 });
//             }
//         //user already enrolled in the course should not be allowed to enroll again
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success: false,
//                 message: "User already enrolled in the course"
//             });
//         }
//         //create a new order using razorpay instance and send the order details to the client
//         const amount = course.price;
//         const currency = "INR";
//         const options = {   
//             amount: amount * 100, // amount in the smallest currency unit
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes: { 
//                   courseId: course_id,             // generate a random receipt id
//                 userId
//             }
//         };
//         //create a new order using razorpay instance
//         try{
//             //intiate the order using razorpay instance
//             const paymentResponse = await instance.orders.create(options);
//             console.log("Payment response: ", paymentResponse);
//             //return response to the client
//             return res.status(200).json({
//                 success: true,
//                 message: "Order created successfully",
//                 courseName: course.courseName,
//                 courseDescription: course.courseDescription,
//                 thumbnail: course.thumbnail,
//                 orderId: paymentResponse.id,
//                 currency: paymentResponse.currency,
//                 amount: paymentResponse.amount,

                 
//             });
//         }
//         catch (error) {
//             console.error("Error while creating order: ", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Error while creating order"
//             });
//         }

//     }
//     catch (error) {
//         console.error("Error in capturePayment: ", error);
//         return res.status(500).json({   
//         success: false,
//         message: "Internal server error"
//         });
//     }


// }

// //verify the payment and enroll the user in the course
// exports.verifySignature = async (req, res) => {
//     //key on server side
//     const webhookSecret = 1234556;
//     //get the signature from the request headers
//     const signature = req.headers['x-razorpay-signature'];

//     //cryptographically verify the signature using the webhook secret and the request body
//   const shasum =   crypto.createHmac('sha256', webhookSecret) 

//   //convert the request body to string and update the shasum
//   shasum.update(JSON.stringify(req.body));
//   //generate the digest
//     const digest = shasum.digest('hex');
//     //compare the digest with the signature
//     if (digest === signature) {
//         console.log("Payment verified successfully");
//         //get the courseId and userId from the request body
//         const {courseId, userId} = req.body.payload.payment.entity.notes;
//         //enroll the user in the course
//         try{
             
//             //find the course by courseId and update the studentsEnrolled array
//             const enrolledCourse = await Course.findOneAndUpdate({
//                  _id: courseId
//                  }, {
//                 $push: {
//                     studentsEnrolled: userId
//                 }
//             }, {new: true});

//             //check response of the update operation
//             if(!enrolledCourse){
//                 return res.status(404).json({
//                     success: false,
//                     message: "Course not found"
//                 });
//             }
//             console.log("User enrolled in the course successfully" , enrolledCourse );
//             //find the stuent addedin the curse to their list of enrolled courses
//             const enrolledStudent = await User.findOneAndUpdate({
//                 _id: userId
//             }, {
//                 $push: {
//                     courses: courseId
//                 }
//             }, {new: true});

//             console.log("User enrolled in the course successfully" , enrolledStudent );
//             //send email to the user about the enrollment in the course
//            const mailResponse = await mailSender(
//                     enrolledStudent.email,
//                     " congrats! Course Enrollment Successful",
//                     "congrats! You have been successfully enrolled in the course " + enrolledCourse.courseName + ". Happy Learning!"
                
//                 );
//                 console.log("Email sent successfully: ", mailResponse.response);
//                 //return success response to the client 
//                 return res.status(200).json({
//                     success: true,
//                     message: "signature verified and user enrolled in the course successfully",
//                 }); 

//             if(!enrolledStudent){
//                 return res.status(404).json({
//                     success: false,
//                     message: "User not found"
//                 });
//             }
//             console.log("User enrolled in the course successfully" , enrolledStudent );
//         }
//         catch (error) {
//             console.error("Error while enrolling user in the course: ", error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Error while enrolling user in the course"
//             });
//         }
//     }
//     else {
//         console.error("Payment verification failed");
//         return res.status(400).json({
//             success: false,
//             message: "Payment verification failed"
//         });
//     }

     
// };