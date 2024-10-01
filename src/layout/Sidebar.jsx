import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { TriLeft, TriRight } from "../components/SvgIcon";
import { changeShowSide, changeExpandedSide } from "../redux/sideSlice";
import {routes, route }from "../routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ArrowRightOutlined } from "@ant-design/icons";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaChartLine, FaRing } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSide } = useSelector((store) => store.side);
  const { user } = useSelector((store) => store.user);
  useEffect(() => {
    if (location.pathname === "/app/") {
      navigate("/app/dashboard/");
    }
  });
  return (
    <aside
      className={`fixed left-0 top-0 h-[calc(100vh)] font-bold font-times  m-[10px] mt-0 ml-0 pt-6  py-[50px] z-[1000000] bg-[#fff]  shadow-md  duration-200
       ${showSide ? "w-[267px]" : "w-0 pl-0 border-0"}`}
    >
      <div
        sementic="sideCartCtr"
        onClick={() => dispatch(changeShowSide())}
        className=" absolute right-0 translate-x-[50%]  cursor-pointer"
      >
        {showSide ? <span className="text-minionBlue p-2 bg-white shadow-md rounded-full flex  items-center 
      text-4xl text-center"> <FaAngleDoubleLeft /> </span>: <span className="text-minionBlue p-2 bg-white shadow-md rounded-full flex  items-center 
      text-4xl text-center"><FaAngleDoubleRight /></span>}
      </div>
      <div className="w-full overflow-hidden">
        <Link to="/" className="flex items-center gap-4 pl-4">
          <img
            src="/logo.svg"
            alt="Logo"
            className="logo-animate w-14 h-14"
          />
          <span className="text-2xl font-satoshi text-[#132f34]">HMPBTK+</span>
        </Link>
        <p className="text-gray-700 font-bold text-[14px] pl-32 font-satoshi -mt-3">
          VERSION 2.0
        </p>
        <ul className="duration-200 h-[80vh] overflow-y-auto mt-2">
          {user.role === "admin"?
          routes.map((route, index) => {
            return (
              <li
                key={index}
                className={`${
                  route.submenu
                    ? ""
                    : "py-3 hover:rounded-tr-md hover:rounded-br-md"
                } font-satoshi cursor-pointer text-minionBlack relative ${
                  location?.pathname === route.path && !route.submenu
                    ? "bg-gray-100"
                    : ""
                }`}
              >
                {route.submenu ? (
                  <SidebarSubmenu {...route} id={index} />
                ) : (
                  <NavLink
                    end
                    to={route.path}
                    onClick={() => dispatch(changeExpandedSide({ id: index }))}
                    className="flex items-center px-4 gap-x-4 text-[20px] font-normal"
                  >
                    {route.icon} {route.name}
                    {location?.pathname === route.path ? (
                      <span
                        className="absolute  h-full right-0 top-1/2 -translate-y-1/2 w-1 rounded-tr-md rounded-br-md bg-minionBlue "
                        aria-hidden="true"
                      ></span>
                    ) : null}
                  </NavLink>
                )}
              </li>
            );
          }):
          route.map((route, index) => {
            return (
              <li
                key={index}
                className={`${
                  route.submenu
                    ? ""
                    : "py-3 hover:rounded-tr-md hover:rounded-br-md"
                } font-satoshi cursor-pointer text-minionBlack relative ${
                  location?.pathname === route.path && !route.submenu
                    ? "bg-gray-100"
                    : ""
                }`}
              >
                {route.submenu ? (
                  <SidebarSubmenu {...route} id={index} />
                ) : (
                  <NavLink
                    end
                    to={route.path}
                    onClick={() => dispatch(changeExpandedSide({ id: index }))}
                    className="flex items-center px-4 gap-x-4 text-[20px] font-normal"
                  >
                    {route.icon} {route.name}
                    {location?.pathname === route.path ? (
                      <span
                        className="absolute  h-full right-0 top-1/2 -translate-y-1/2 w-1 rounded-tr-md rounded-br-md bg-minionBlue "
                        aria-hidden="true"
                      ></span>
                    ) : null}
                  </NavLink>
                )}
              </li>
            );
          })
          }
        </ul>
      </div>
    </aside>
  );
}
