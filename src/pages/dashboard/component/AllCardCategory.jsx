import React from "react";
import { Tooltip } from "antd";
import { FaApple } from "react-icons/fa";
import {
  EyeIcon,
  HandThumbUpIcon,
  InboxIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";
import { Link } from "react-router-dom";
const AllTable = ({ title, showData }) => {
  return (
    <div className="w-full h-[450px] ">
      <h3 className="mt-1 flex items-center text-gray-500 text-xl gap-2">
        <FaApple className="h-6 w-6" /> {title}
      </h3>
      <div className="w-full h-[320px] overflow-auto mt-4">
        {showData?.map((item, key) => {
          return (
            <Link to={`/app/article/${item?.articleId}`} key={key}>
              <div className="h-[50px] border-b-2 rounded-l-lg flex justify-between items-center cursor-pointer hover:bg-[#ddfaff] duration-300 ease-linear ">
                <div className="flex items-center">
                  <Tooltip
                    overlayInnerStyle={{ width: "200px", padding: "12px" }}
                    placement="bottom"
                    title={() => {
                      return (
                        <>
                          <div className="text-white-600 flex justify-between">
                            <span className=" text-minionBlue">
                              Name:{" "}
                              <span className="text-white ml-4">
                                {item?.name}
                              </span>{" "}
                            </span>
                          </div>
                          <div className="text-white-600 flex justify-between">
                            <span className=" text-minionBlue">
                              Email:{" "}
                              <span className="text-white ml-4">
                                {item?.email}
                              </span>{" "}
                            </span>
                          </div>
                        </>
                      );
                    }}
                  >
                    <img
                      className=" w-10 h-10 rounded-full"
                      src={
                        item?.avatar?.length
                          ? process.env.REACT_APP_API_BASE_URL +
                            "/api/file/download/" +
                            item?.avatar[0]
                          : "/image/avatar.png"
                      }
                    />
                  </Tooltip>
                  <h1 className=" text-lg ml-6 truncate w-30">{item?.title}</h1>
                </div>
                <div className="flex items-center gap-5 pr-4">
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    {moment(item?.date).fromNow(false)}
                  </div>
                  <div className="flex items-center">
                    <EyeIcon className='"w-5 h-5  ' />
                    <p>{item?.view}</p>
                  </div>
                  <div className="flex items-center">
                    <HandThumbUpIcon className='"w-5 h-5 ' />{" "}
                    <p>{item?.like}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {showData?.length ? (
          ""
        ) : (
          <div className="w-full flex flex-col justify-center m-auto items-center py-20">
            <InboxIcon className="w-20 opacity-[0.7] py-3" />
            <span className=" text-xl opacity-[0.7]">No category found!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTable;
