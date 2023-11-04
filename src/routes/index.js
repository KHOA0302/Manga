import Home from "~/pages/Home";
import Genres from "~/pages/Genres";
import New from "~/pages/New";
import Top from "~/pages/Top";
import Search from "~/pages/Search";
import DetailManga from "~/pages/DetailManga";
import ContentManga from "~/pages/ContentManga";
import { Fragment } from "react";
import History from "~/pages/History";

export const publicRoutes = [
  { path: "/", component: Home },
  { path: "/genres", component: Genres },
  { path: "/top", component: Top },
  { path: "/new", component: New },
  { path: "/search", component: Search },
  { path: "/manga/:mangaId", component: DetailManga },
  {
    path: "/manga/:mangaId/:chapterId",
    component: ContentManga,
    layout: Fragment,
  },
  { path: "/history", component: History },
];

export const headerOptionRoutes = [
  { path: "/", component: Home },
  { path: "/genres", component: Genres },
  { path: "/top", component: Top },
  { path: "/new", component: New },
];
