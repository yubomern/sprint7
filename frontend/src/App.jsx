
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import CourseDetails from './pages/CourseDetails';
import Catalog from './pages/Catalog';
 
import Navbar from "./components/common/Navbar"

import OpenRoute from "./components/core/Auth/OpenRoute"
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings/Settings";
import MyCourses from './components/core/Dashboard/MyCourses';
import EditCourse from './components/core/Dashboard/EditCourse/EditCourse';
import Instructor from './components/core/Dashboard/Instructor';


import Cart from "./components/core/Dashboard/Cart/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";

import ViewCourse from "./pages/ViewCourse";
import VideoDetails from './components/core/ViewCourse/VideoDetails';

import { ACCOUNT_TYPE } from './utils/constants';

import { HiArrowNarrowUp } from "react-icons/hi"
import Chat from "./components/core/Chat/Chat";
import MyCalendar from "./components/core/Calendars/MyCalendar";
import RefundForm from "./components/core/Dashboard/Refund/RefundFormstripe.jsx";
import RefundWallet from "./components/core/Dashboard/Refund/Wallet";
import Category from "./components/core/Dashboard/Category/Category.jsx";
import TodoApp from "./components/core/Dashboard/Todo/Todo.jsx";
import Meet from "./components/core/Dashboard/Meet/Meet.jsx";
import WalletApp from "./components/core/Dashboard/Refund/WalletApp.jsx";
import OCRUploader from "./components/core/Dashboard/ocr/OcrCr.jsx";
import UploadOcr from "./components/core/Dashboard/ocr/UploadOcr.jsx";
import TestOcr from "./components/core/Dashboard/ocr/TestOcr.jsx";
import UploadPdfOcr from "./components/core/Dashboard/ocr/OcrPdf.jsx";
import InstructorList from "./pages/InstructorList.jsx";
import InstructorDetails from "./pages/InstructorDetails.jsx";
import StudentStats from "./components/core/stats/studentStatistics.jsx";
import CourseStats from "./components/core/stats/CourseStats.jsx";
import Sessions from "./components/core/Dashboard/session/SessionModal.jsx";
import StudentCalendar from "./components/core/Dashboard/session/StudentCalendar.jsx";
import ChatOk from "./components/core/Chat/ChatOk.jsx";
import ChatApp from "./components/core/Chat/ChatApp.jsx";
import TeacherPosts from "./components/core/Dashboard/Teacher/TeacherPost.jsx";
import TeacherDashboard from "./components/core/Dashboard/Teacher/TeacherDashboard.jsx";
import ReclamationStudent from "./components/core/Reclamations/ReclamationStudent.jsx";



function App() {

  const { user } = useSelector((state) => state.profile)

  // Scroll to the top of the page when the component mounts
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname])

  useEffect(() => {
    scrollTo(0, 0);
  }, [location])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  // Go upward arrow - show , unshow
  const [showArrow, setShowArrow] = useState(false)

  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true)
    } else setShowArrow(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleArrow);
    return () => {
      window.removeEventListener('scroll', handleArrow);
    }
  }, [showArrow])


  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />

      {/* go upward arrow */}
      <button onClick={() => window.scrollTo(0, 0)}
        className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${showArrow ? 'bottom-6' : '-bottom-24'} `} >
        <HiArrowNarrowUp />
      </button>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />

        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="signup" element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="login" element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password" element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email" element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id" element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />




        {/* Protected Route - for Only Logged in User */}
        {/* Dashboard */}
        <Route element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          
          <Route path="dashboard/Settings" element={<Settings />} />
          <Route path="dashboard/category" element={<Category />} />
          <Route path="dashboard/todo" element={<TodoApp />} />
          <Route path="dashboard/chat" element={<Chat />} />
          <Route path="dashboard/instructors" element={<InstructorList />} />
          <Route path="dashboard/instructor/:id" element={<InstructorDetails />} />


          <Route path="dashboard/teacher" element={<TeacherPosts />} />
          <Route path="dashboard/teacherdash" element={<TeacherDashboard />} />
           <Route path="dashboard/reclamation" element={<ReclamationStudent />} />


          


          <Route path="dashboard/ocr" element={<UploadPdfOcr />} />
          <Route path="dashboard/ocrupload" element={<UploadOcr />} />

          <Route path="dashboard/calendar" element={<MyCalendar />} />

          <Route path="dashboard/meet" element={<Meet />} />


          <Route path="/dashboard/student-stats" element={

              <StudentStats />

          } />
          <Route path="/dashboard/course-stats" element={

              <CourseStats />

          } />

          <Route path="dashboard/refund" element={<WalletApp />} />
          <Route path="dashboard/session" element={<Sessions />} />



          <Route path="dashboard/jetsi" element={<StudentCalendar />} />



          {/* Route only for Students */}
          {/* cart , EnrolledCourses */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
            </>
          )}

          {/* Route only for Instructors */}
          {/* add course , MyCourses, EditCourse*/}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
            </>
          )}
        </Route>


        {/* For the watching course lectures */}
        <Route
          element={
            <ProtectedRoute>
              <ViewCourse />
            </ProtectedRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <Route
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          )}
        </Route>




        {/* Page Not Found (404 Page ) */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>

    </div>
  );
}

export default App;
