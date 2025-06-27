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
    category: "Akademik",
    children: [
      {
        title: "Pengelolaan Akademik",
        iconName: "MdOutlineFolderShared",
        children: [
          { title: "Pendaftaran", path: "/registration", iconName: "FaUserPen", permissionName: "registration" },
          { title: "Absensi Siswa", path: "/absence", iconName: "FaCalendarDay", permissionName: "studentatt" },
          { title: "Akademik", path: "/academic", iconName: "FaChalkboardUser", permissionName: "academic" },
          { title: "Catatan Kelas", path: "/class-note", iconName: "FaRegFileAlt", permissionName: "classnote" },
          { title: "Jadwal Mata Pelajaran", path: "/config/class-schedule", iconName: "TbCalendarClock", permissionName: "subjsched" },
        ],
      },
      {
        title: "Laporan",
        iconName: "BiBarChartAlt2",
        children: [
          { title: "Rekap Absensi", path: "/absence-recap", iconName: "FaCalendarDay", permissionName: "studentattrep" },
          { title: "Rekap Ujian", path: "/exam-recap", iconName: "FaRegFileAlt", permissionName: "examrecap" },
        ],
      },
      {
        title: "Konfigurasi",
        iconName: "IoSettingsOutline",
        children: [
          { title: "Jenjang", path: "/grade", iconName: "FaGraduationCap", permissionName: "grade" },
          { title: "Kelas", path: "/config/class", iconName: "FaChalkboardUser", permissionName: "class" },
          { title: "Mata Pelajaran", path: "/subject", iconName: "MdListAlt", permissionName: "subject" },
          { title: "Kurikulum", path: "/curriculum", iconName: "BsCardText", permissionName: "curriculum" },
          { title: "Data Siswa", path: "/student-data", iconName: "FaRegUser", permissionName: "student" },
        ],
      },
    ],
  },
  {
    category: "Arsip",
    children: [
      {
        title: "Dokumen",
        path: "/document",
        iconName: "MdOutlineDocumentScanner",
        permissionName: "document",
      },
      {
        title: "Konfigurasi",
        iconName: "IoSettingsOutline",
        children: [
          { title: "Tipe Dokumen", path: "/config/document-type", iconName: "FaFileCircleQuestion", permissionName: "doctype" },
        ],
      },
    ],
  },
  {
    category: "Manajemen SDM",
    children: [
      {
        title: "Guru",
        path: "/teacher",
        iconName: "FaRegUser",
        permissionName: "teacher",
      },
      {
        title: "Absensi Guru",
        path: "/teacher-absence",
        iconName: "FaCalendarDay",
        permissionName: "teacheratt",
      },
      {
        title: "Laporan",
        iconName: "BiBarChartAlt2",
        children: [
          { title: "Rekap Absensi Guru", path: "/teacher-absence-recap", iconName: "FaCalendarDay", permissionName: "teacherattrep" },
        ],
      },
      {
        title: "Konfigurasi",
        iconName: "IoSettingsOutline",
        children: [
          { title: "Jadwal Kerja", path: "/config/working-schedule", iconName: "FaRegClock", permissionName: "worksched" },
        ],
      },
    ],
  },
  {
    category: "Pengelolaan Berita",
    children: [
      {
        title: "Berita",
        path: "/news-event",
        iconName: "FaRegNewspaper",
        permissionName: "news",
      },
    ],
  },
  {
    category: "Pengaturan",
    children: [
      {
        title: "Users (Pengguna)",
        path: "/users",
        iconName: "SiAdGuard",
        permissionName: "users",
      },
      {
        title: "Hak Akses",
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