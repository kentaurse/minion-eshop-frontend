import { lazy } from "react";
const Dashboard = lazy(() => import("../pages/dashboard"));
const Home = lazy(() => import("../pages/home"));
const StoreRouter = lazy(() => import("../pages/store/router"));
const ProductRouter = lazy(() => import("../pages/product/router"));
const CategoryRouter = lazy(() => import("../pages/category/router"));
const InventoryRouter = lazy(() => import("../pages/inventory/router"));
const ArticleRouter = lazy(() => import("../pages/articles/router"));
const UserRouter = lazy(() => import("../pages/user/router"));
const Blank = lazy(() => import("../pages/blank"));
const Account = lazy(() => import("../pages/account"));
const MyAccount = lazy(() => import("../pages/account/index"));
const Message = lazy(() => import("../pages/chat/message"));

const routes = [
  {
    path: "/",
    component: Dashboard,
  },
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/store/*",
    component: StoreRouter,
  },
  {
    path: "/product/*",
    component: ProductRouter,
  },
  {
    path: "/category/*",
    component: CategoryRouter,
  },
  {
    path: "/inventory/*",
    component: InventoryRouter,
  },
  {
    path: "/user/*",
    component: UserRouter,
  },
  {
    path: "/blank/*",
    component: Blank,
  },
  {
    path: "/profile",
    component: Account,
  },
  {
    path: "/account",
    component: MyAccount,
  },
  {
    path: "/message",
    component: Message,
  },
  {
    path: "/article/*",
    component: ArticleRouter,
  },
];

export default routes;
