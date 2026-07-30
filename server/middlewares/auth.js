// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
// Configuring dotenv to load environment variables from .env file
dotenv.config();

// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
  try {
    console.log("========== AUTH MIDDLEWARE ==========");

    console.log("Authorization Header:", req.header("Authorization"));
    console.log("Cookies:", req.cookies);
    console.log("Body:", req.body);

    const authHeader = req.header("Authorization");

    const token =
      req.cookies?.token ||
      req.body?.token ||
      (authHeader ? authHeader.replace("Bearer ", "") : null);

    console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decode);

    req.user = decode;

    next();
  } catch (error) {
    console.log("========== AUTH ERROR ==========");
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Something Went Wrong While Validating the Token",
    });
  }
};
exports.isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};



// const jwt = require("jsonwebtoken");
// const Profile = require("../models/Profile");
// const dotenv = require("dotenv");
// dotenv.config();
// const User = require("../models/User");

// //auth
// exports.auth = async (req, res, next) => {
//     try {
//         //extract token from request headers, cookies, or body
//         const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
//         //if token is not present, return 401
//         if (!token) {
//             return res.status(401).json({   
//                 success: false,
//                 message: "No token provided"
//             });
//         }
// //verify token
//          try {
//             const decode = jwt.verify(token, process.env.JWT_SECRET);
//             console.log("Decoded token: ", decode);
//             req.user = decode;
//             next();
//         }
//         catch (error) {
//             console.error("Error in token verification: ", error);
//             return res.status(401).json({   
//                 success: false,
//                 message: "Invalid token"
//             });
//         }

        
//     }
//     catch (error) {
//         console.error("Error in auth middleware: ", error);
//         return res.status(401).json({   
//              success: false,
//              message: "something went wrong while verifying token"
//         });
//     }
// }   


// // isstudent
// exports.isStudent = async (req, res, next) => {
//     try {
//          if(req.user.accountType !== "Student") {
//             return res.status(403).json({
//                 success: false,
//                 message: "Access denied. Only students can perform this action."
//             });
//         }
//         next();
//     } catch (error) {
//         console.error("Error in isStudent middleware: ", error);
//         return res.status(500).json({
//             success: false,
//             message: "something went wrong while verifying student role"
//         });
//     }
// };

// // isinstructor
// exports.isInstructor = async (req, res, next) => {
//     try {
//         if(req.user.accountType !== "Instructor") {
//             return res.status(403).json({
//                 success: false,
//                 message: "Access denied. Only instructors can perform this action."
//             });
//         }
//         next();
//     } catch (error) {
//         console.error("Error in isInstructor middleware: ", error);
//         return res.status(500).json({
//             success: false,
//             message: "something went wrong while verifying instructor role"
//         });
//     }
// };
 

// // isadmin
// exports.isAdmin = async (req, res, next) => {
//     try {
//         if(req.user.accountType !== "Admin") {
//             return res.status(403).json({
//                 success: false,
//                 message: "Access denied. Only admins can perform this action."
//             });
//         }
//         next();
//     }
//     catch (error) {
//         console.error("Error in isAdmin middleware: ", error);
//         return res.status(500).json({
//             success: false,
//             message: "something went wrong while verifying admin role"
//         });
//     }
        
// };

