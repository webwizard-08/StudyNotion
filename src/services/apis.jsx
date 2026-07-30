const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
console.log("BASE_URL =", BASE_URL);

export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API:
    BASE_URL + "/profile/getEnrolledCourses",

  GET_INSTRUCTOR_DATA_API:
    BASE_URL + "/profile/instructorDashboard",
};


export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payments/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payments/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API:
    BASE_URL + "/payments/sendPaymentSuccessEmail",
};

export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API:
    BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API:
    BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API:
    BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API:
    BASE_URL + "/profile/deleteProfile",
};
// COURSE ENDPOINTS

  export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",

  GET_ALL_INSTRUCTOR_COURSES_API:
    BASE_URL + "/course/getInstructorCourses",

  DELETE_COURSE_API:
    BASE_URL + "/course/deleteCourse",

  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",

  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",

  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",

  CREATE_RATING_API:
    BASE_URL + "/course/createRating",

  LECTURE_COMPLETION_API:
    BASE_URL + "/course/updateCourseProgress",
};

// CATEGORIES
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
};

export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
};

export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
};

// CONTACT US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};