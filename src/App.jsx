import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar from "./components/core/HomePage/common/Navbar";
 import About from "./pages/About";
 import Contact from "./pages/Contact";
 import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Settings from "./components/core/Dashboard/Settings";
import Cart from "./components/core/Dashboard/Cart";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import MyCourses from "./components/core/Dashboard/MyCourses";
import AddCourse from "./components/core/Dashboard/AddCourse";
import EditCourse from "./components/core/Dashboard/EditCourse/index.jsx";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
function App() {
const { user } = useSelector((state) => state.profile);
console.log("User:", user);
console.log("Account Type:", user?.accountType);
console.log("Student Constant:", ACCOUNT_TYPE.STUDENT);
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />

      <Routes>

  <Route path="/" element={<Home />} />
   <Route path="catalog/:catalogName" element={<Catalog/>} />
      <Route path="courses/:courseId" element={<CourseDetails/>} />
  <Route path="/about" element={<About />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/update-password/:token" element={<UpdatePassword />} />
  <Route path="/verify-email" element={<VerifyEmail />} />
  <Route path="/contact" element={<Contact />} />

  <Route path="/dashboard" element={<Dashboard />}>
  <Route path="my-profile" element={<MyProfile />} />
  <Route path="settings" element={<Settings />} />

  {user?.accountType === ACCOUNT_TYPE.STUDENT && (
    <>
      <Route path="cart" element={<Cart />} />
      <Route path="enrolled-courses" element={<EnrolledCourses />} />
    </>
  )}

  {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
    <>
      <Route path="instructor" element={<Instructor />} />   {/* ✅ Yahan */}
      <Route path="my-courses" element={<MyCourses />} />
      <Route path="add-course" element={<AddCourse />} />
      <Route path="edit-course/:courseId" element={<EditCourse />} />
    </>
  )}
</Route>

   <Route element={
        <PrivateRoute>
          <ViewCourse />
        </PrivateRoute>
      }>

      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route 
            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
          </>
        )
      }

      </Route>
      

</Routes>
    </div>
  );
}

export default App;