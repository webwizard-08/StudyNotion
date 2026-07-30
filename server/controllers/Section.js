const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
// CREATE a new section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

		res.status(200).json({
			success: true,
			message: section,
			data:course,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   


// //
// const Section = require('../models/Section');
// const Course = require('../models/Course');

// exports.createSection = async (req, res) => {
//     try {
//         //fetch data from req.body
//         const { sectionName, courseId } = req.body;
//         //dtaa validation
//         if (!sectionName || !courseId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }
//         //create section 
//         const newSection = await Section.create({sectionName});
//         //update course with section object id
//         const updatedCourse = await Course.findByIdAndUpdate(
//              courseId,
//             { $push:
                
//                 { sections: newSection._id } },
//             { new: true }
//         );

//         //TODO use populate to replace section/sub-section both in the updatedcourse details
//         //return success response
//         return res.status(201).json({
//             success: true,
//             message: "Section created successfully",    
//         }); 
//     }
//     catch (error) {
//         console.error("Error in createSection: ", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }

// //update section
// exports.updateSection = async (req, res) => {
//     try {   
//         //data input from req.body
//         const { sectionId, sectionName } = req.body;
//         //data validation
//         if (!sectionId || !sectionName) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }
//         //update data
//         const section = await Section.findByIdAndUpdate(
//             sectionId,
//             { sectionName },
//             { new: true }
//         );
//         //return response
//         return res.status(200).json({
//             success: true,
//             message: "Section updated successfully",
//             data: section
//         });
//     }
//     catch (error) {
//         console.error("Error in updateSection: ", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }   
// }

// //delete section
// exports.deleteSection = async (req, res) => {
//     try {   
//         //data input id from req.params
//         const { sectionId } = req.params;
//         //data validation
//         if (!sectionId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Section ID is required"
//             });
//         }
//         //delete section
//         const section = await Section.findByIdAndDelete(sectionId);
//         //todo delete object id from course schema as well
//         //return response
//         return res.status(200).json({
//             success: true,
//             message: "Section deleted successfully",
//             data: section
//         });
//     }
//     catch (error) {
//         console.error("Error in deleteSection: ", error);
//         return res.status(500).json({   
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }   
