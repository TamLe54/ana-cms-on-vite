
const routes = {
  Dashboard: { path: "/" },
  Affirmation: { path: '/affirmations', title: "Affirmations" },
  //CreateDrop: { path: "/drop/create", title: "Create Drop" },
  DropPost: { path: '/drops/:dropId/posts', title: "All Posts" },
  DropPostDetail: { path: '/drops/:dropId/posts/:postId', title: "Post Detail" },
  Report: { path: '/reports', title: "Report" },
  ReportDetail: { path: '/reports/:reportId', title: "Report Detail" },
  DailyVibe: { path: '/daily-vibes', title: "Daily vibe" },
  FeedBackDetail: { path: '/feedbacks/:feedbackId', title: "Feedback Detail" },
  SignIn: { path: "/login" },
  SignUp: { path: "/sign-up" },
  ForgotPassword: { path: "/forgot-password" },
  ResetPassword: { path: "/reset-password" },
  NotFound: { path: "/404" },
  ServerError: { path: "/500" },
  Journey:{path:'/journey', title:"Journey"}
};

export default routes;
