import { Provider } from "react-redux";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { store } from "./store";
import "./App.css";
import Dashboard from "./features/dashboard";
import Login from "./features/login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavBar from "./components/NavBar";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Sidebar } from "./components/SideBar";
import Registration from "./features/registration";
import StudentData from "./features/student-data";
import Classes from "./features/classes";
import Absence from "./features/absence";
import Subject from "./features/subject";
import ClassSchedule from "./features/class-schedule";
import ExamRecap from "./features/exam-recap";
import AbsenceRecap from "./features/absence-recap";
import ConfigClass from "./features/config-class";
import Grade from "./features/grade";
import ConfigClassSchedule from "./features/config-class-schedule";
import Document from "./features/document";
import DocumentType from "./features/document-type";
import WorkingSchedule from "./features/working-schedule";
import TeacherAbsenceRecap from "./features/teacher-absence-recap";
import TeacherAbsence from "./features/teacher-absence";
import Teacher from "./features/teacher";
import Users from "./features/users";
import NewsEvent from "./features/news-event";
import AccessRights from "./features/access-rights";

function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavBar />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/student-data" element={<StudentData />} />
                <Route path="/class" element={<Classes />} />
                <Route path="/absence" element={<Absence />} />
                <Route path="/subject" element={<Subject />} />
                <Route path="/class-schedule" element={<ClassSchedule />} />
                <Route path="/absence-recap" element={<AbsenceRecap />} />
                <Route path="/exam-recap" element={<ExamRecap />} />
                <Route path="/grade" element={<Grade />} />
                <Route path="/config/class" element={<ConfigClass />} />
                <Route path="/config/class-schedule" element={<ConfigClassSchedule />} />
                <Route path="/document" element={<Document />} />
                <Route path="/config/document-type" element={<DocumentType />} />
                <Route path="/teacher" element={<Teacher />} />
                <Route path="/teacher-absence" element={<TeacherAbsence />} />
                <Route path="/teacher-absence-recap" element={<TeacherAbsenceRecap />} />
                <Route path="/config/working-schedule" element={<WorkingSchedule />} />
                <Route path="/news-event" element={<NewsEvent />} />
                <Route path="/users" element={<Users />} />
                <Route path="/access-rights" element={<AccessRights />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? (
    <div className="flex h-[92.5vh]">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};
