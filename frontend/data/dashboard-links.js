import { ACCOUNT_TYPE } from './../src/utils/constants';

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 6,
    name: "Purchase History",
    path: "/dashboard/purchase-history",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscHistory",
  },
  {
    id: 7,
    name: "Category ",
    path: "/dashboard/category",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },

  {
    id: 8,
    name: "chat",
    path: "/dashboard/chat",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscComment",
  },

  {
    id: 9,
    name: "chat with student",
    path: "/dashboard/chat",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscComment",
  },


  {
    id: 10,
    name: "calendar",
    path: "/dashboard/calendar",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscMortarBoard",
  },
  {
    id: 11,
    name: "calendar",
    path: "/dashboard/calendar",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },

  {
    id: 12,
    name: "refund",
    path: "/dashboard/refund",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 13,
    name: "todo",
    path: "/dashboard/todo",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },


  {
    id: 14,
    name: "meet calendar",
    path: "/dashboard/meet",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscComment",
  },


  {
    id: 15,
    name: "meet",
    path: "/dashboard/meet",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  {
    id: 16,
    name: "ocr",
    path: "/dashboard/ocr",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  //dashboard/ocrupload
  {
    id: 17,
    name: "ocrtest",
    path: "/dashboard/ocrupload",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },

  {
    id: 18,
    name: "review instructors",
    path: "/dashboard/instructors",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },
  //dashboard/student-stats

  {
    id: 19,
    name: "student-stats",
    path: "/dashboard/student-stats",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscMortarBoard",
  },
  {
    id: 20,
    name: "course-stats",
    path: "/dashboard/course-stats",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscMortarBoard",
  },



  {
    id: 21,
    name: "session ",
    path: "/dashboard/session",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscMortarBoard",
  },

  {
    id: 22,
    name: "jetsi",
    path: "/dashboard/jetsi",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },


    {
    id: 23,
    name: "teacher",
    path: "/dashboard/teacher",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscMortarBoard",
  },

    {
    id: 24,
    name: "teacherdashboard",
    path: "/dashboard/teacherdash",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscMortarBoard",
  },
  {
    id: 25,
    name: "reclamation",
    path: "/dashboard/reclamation",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscMortarBoard",
  },
   {
    id: 26,
    name: "instructorprofile",
    path: "/dashboard/profileinstructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscMortarBoard",
  },
   {
    id: 27,
    name: "studentprofile",
    path: "/dashboard/profilestudent",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },

   //dashboard/reclamation
   //dashboard/notif

     {
    id: 28,
    name: "notif",
    path: "/dashboard/notif",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscMortarBoard",
  },

  {
    id: 29,
    name: "notifprof",
    path: "/dashboard/notif",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscMortarBoard",
  },

];
