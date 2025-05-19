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
          { title: "Registration", path: "/registration", iconName: "FaUserPen" },
          { title: "Student Data", path: "/student-data", iconName: "FaRegUser" },
          { title: "Classes", path: "/class", iconName: "FaChalkboardUser" },
          { title: "Absence", path: "/absence", iconName: "FaCalendarDay" },
        ],
      },
      {
        title: "Curriculum",
        iconName: "BsCardText",
        children: [
          { title: "Subject", path: "/subject", iconName: "MdListAlt" },
          { title: "Class Schedule", path: "/class-schedule", iconName: "TbCalendarClock" },
        ],
      },
      {
        title: "Reporting",
        iconName: "BiBarChartAlt2",
        children: [
          { title: "Absence Recap", path: "/absence-recap", iconName: "FaCalendarDay" },
          { title: "Exam Recap", path: "/exam-recap", iconName: "FaRegFileAlt" },
        ],
      },
      {
        title: "Configuration",
        iconName: "IoSettingsOutline",
        children: [
          { title: "Grade", path: "/grade", iconName: "FaGraduationCap" },
          { title: "Classes", path: "/config/class", iconName: "FaChalkboardUser" },
          { title: "Class Schedule", path: "/config/class-schedule", iconName: "TbCalendarClock" },
        ],
      },
    ],
  },
  {
    category: "Archieve",
    children: [
      {
        title: "Document",
        path: "/document",
        iconName: "MdOutlineDocumentScanner",
      },
      {
        title: "Configuration",
        iconName: "IoSettingsOutline",
        children: [
          { title: "Document Type", path: "/config/document-type", iconName: "FaFileCircleQuestion" },
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
      },
      {
        title: "Absence",
        path: "/teacher-absence",
        iconName: "FaCalendarDay",
      },
      {
        title: "Reporting",
        iconName: "BiBarChartAlt2",
        children: [
          { title: "Absence Recap", path: "/teacher-absence-recap", iconName: "FaCalendarDay" },
        ],
      },
      {
        title: "Configuration",
        iconName: "IoSettingsOutline",
        children: [
          { title: "Working Schedule", path: "/config/working-schedule", iconName: "FaRegClock" },
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
      },
      {
        title: "Access Rights",
        path: "/access-rights",
        iconName: "IoSettingsOutline",
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