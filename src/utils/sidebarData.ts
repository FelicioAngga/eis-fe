import { MdListAlt, MdOutlineDocumentScanner, MdOutlineFolderShared } from "react-icons/md";
import { FaChalkboardUser, FaRegUser, FaUserPen, FaCalendarDay, FaFileCircleQuestion, FaRegClock, FaRegNewspaper } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { TbCalendarClock } from "react-icons/tb";
import { BiBarChartAlt2 } from "react-icons/bi";
import { FaGraduationCap, FaRegFileAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { SiAdguard } from "react-icons/si";

interface MenuItem {
  title: string;
  path?: string;
  children?: MenuItem[];
  iconName?: string;
  permissionName?: string;
}
interface MenuCategory {
  category: string;
  children: MenuItem[];
}

export const sideBarCategoryMenu: MenuCategory[] = [
  {
    category: "Academic",
    children: [
      {
        title: "Student Management",
        iconName: "MdOutlineFolderShared",
        children: [
          { title: "Registration", path: "/registration", iconName: "FaUserPen", permissionName: "registration" },
          { title: "Student Data", path: "/student-data", iconName: "FaRegUser", permissionName: "student" },
          { title: "Absence", path: "/absence", iconName: "FaCalendarDay", permissionName: "studentatt" },
        ],
      },
      {
        title: "Curriculum",
        iconName: "BsCardText",
        children: [
          { title: "Academic", path: "/academic", iconName: "FaChalkboardUser", permissionName: "academic" },
          { title: "Class Note", path: "/class-note", iconName: "FaRegFileAlt", permissionName: "classnote" },
          { title: "Class Schedule", path: "/config/class-schedule", iconName: "TbCalendarClock", permissionName: "subjsched" },
        ],
      },
      {
        title: "Reporting",
        iconName: "BiBarChartAlt2",
        children: [
          { title: "Absence Recap", path: "/absence-recap", iconName: "FaCalendarDay", permissionName: "studentattrep" },
          { title: "Exam Recap", path: "/exam-recap", iconName: "FaRegFileAlt", permissionName: "examrecap" },
        ],
      },
      {
        title: "Configuration",
        iconName: "IoSettingsOutline",
        children: [
          { title: "Grade", path: "/grade", iconName: "FaGraduationCap", permissionName: "grade" },
          { title: "Classes", path: "/config/class", iconName: "FaChalkboardUser", permissionName: "class" },
          { title: "Subject", path: "/subject", iconName: "MdListAlt", permissionName: "subject" },
        ],
      },
    ],
  },
  {
    category: "Archive",
    children: [
      {
        title: "Document",
        path: "/document",
        iconName: "MdOutlineDocumentScanner",
        permissionName: "document",
      },
      {
        title: "Configuration",
        iconName: "IoSettingsOutline",
        children: [
          { title: "Document Type", path: "/config/document-type", iconName: "FaFileCircleQuestion", permissionName: "doctype" },
        ],
      },
    ],
  },
  {
    category: "Human Resource",
    children: [
      {
        title: "Teacher",
        path: "/teacher",
        iconName: "FaRegUser",
        permissionName: "teacher",
      },
      {
        title: "Absence",
        path: "/teacher-absence",
        iconName: "FaCalendarDay",
        permissionName: "teacheratt",
      },
      {
        title: "Reporting",
        iconName: "BiBarChartAlt2",
        children: [
          { title: "Absence Recap", path: "/teacher-absence-recap", iconName: "FaCalendarDay", permissionName: "teacherattrep" },
        ],
      },
      {
        title: "Configuration",
        iconName: "IoSettingsOutline",
        children: [
          { title: "Working Schedule", path: "/config/working-schedule", iconName: "FaRegClock", permissionName: "worksched" },
        ],
      },
    ],
  },
  {
    category: "Website Management",
    children: [
      {
        title: "News & Event",
        path: "/news-event",
        iconName: "FaRegNewspaper",
        permissionName: "news",
      },
    ],
  },
  {
    category: "Settings",
    children: [
      {
        title: "Users",
        path: "/users",
        iconName: "SiAdGuard",
        permissionName: "users",
      },
      {
        title: "Access Rights",
        path: "/access-rights",
        iconName: "IoSettingsOutline",
        permissionName: "accessrights",
      },
    ],
  },
];

export const menuIconMap = {
  MdOutlineFolderShared: MdOutlineFolderShared,
  FaUserPen: FaUserPen,
  FaRegUser: FaRegUser,
  FaChalkboardUser: FaChalkboardUser,
  FaCalendarDay: FaCalendarDay,
  BsCardText: BsCardText,
  MdListAlt: MdListAlt,
  TbCalendarClock: TbCalendarClock,
  BiBarChartAlt2: BiBarChartAlt2,
  FaRegFileAlt: FaRegFileAlt,
  IoSettingsOutline: IoSettingsOutline,
  FaGraduationCap: FaGraduationCap,
  MdOutlineDocumentScanner: MdOutlineDocumentScanner,
  FaFileCircleQuestion: FaFileCircleQuestion,
  FaRegClock: FaRegClock,
  FaRegNewspaper: FaRegNewspaper,
  SiAdGuard: SiAdguard,
}