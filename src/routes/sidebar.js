import { lazy } from "react";
import * as Icons from "../layout/Icons";
import { FaPlus, FaProductHunt, FaInfo, FaStore, FaShoppingCart } from "react-icons/fa";
import { MessageOutlined } from "@ant-design/icons";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";



export const routes = [
  {
    path: "/app/dashboard",
    icon: <Icons.Dashboard />,
    name: "Dashboard",
  },
 
  {
    path: "/app/category",
    icon: <Icons.Category />,
    name: "Category",
    submenu: [
      {
        path: "/app/category",
        icon: <Icons.AllCategory />,
        name: "All Categories",
      },
      {
        path: "/app/category/addition",
        icon: <FaPlus></FaPlus>,
        name: "New Addition",
      },
    ],
  },
  {
    path: "/app/product",
    icon: <FaProductHunt className="text-xl"></FaProductHunt>,
    name: "Product",
    submenu: [
      {
        path: "/app/product",
        icon: <Icons.AllProducts />,
        name: "All Products",
      },
      {
        path: "/app/product/addition",
        icon: <FaPlus></FaPlus>,
        name: "New Product",
      },
      // {
      //   path: "/app/product/cart",
      //   icon: <FaShoppingCart></FaShoppingCart>,
      //   name: "Cart",
      // },
    ],
  },
  {
    path: "/app/inventory",
    icon: <FaInfo className="text-xl"></FaInfo>,
    name: "Inventory",
    
  },
  {
    path: "/app/article",
    icon: <ClipboardDocumentListIcon className="w-6 h-6" />, // icon component
    name: "Article",
  },
  // {
  //   path: "/app/message",
  //   icon: <MessageOutlined />,
  //   name: "Message",
  // },
  {
    path: "/app/user",
    icon: <Icons.User />,
    name: "User",
  },
];




export const route = [
  
  {
    path: "/app/home",
    icon: <Icons.Dashboard />,
    name: "Home",
  },
  
  {
    path: "/app/product",
    icon: <FaProductHunt className="text-xl"></FaProductHunt>,
    name: "Product",
    submenu: [
      {
        path: "/app/product",
        icon: <Icons.AllProducts />,
        name: "All Products",
      },
      
      // {
      //   path: "/app/product/cart",
      //   icon: <FaShoppingCart></FaShoppingCart>,
      //   name: "Cart",
      // },
    ],
  },
 
  {
    path: "/app/article",
    icon: <ClipboardDocumentListIcon className="w-6 h-6" />, // icon component
    name: "Article",
  },
  // {
  //   path: "/app/message",
  //   icon: <MessageOutlined />,
  //   name: "Message",
  // },
  
];


