import React, { useRef, useState } from "react";
import { FaSearch, FaBookOpen } from "react-icons/fa";
import {
  ClockIcon,
  EyeIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";
const ProductHistory = ({ showData,userAvatar }) => {
  const searchRef = useRef();
  const [flag, setFlag] = useState(false);
  return (
    <>
      <div className="w-full bg-white h-[500px] rounded-xl shadow-lg">
        <div className="flex justify-between items-end pb-4 bg-minionBlue rounded-t-lg">
          <h2 className=" text-lg pt-6 pl-6 font-bold text-white flex items-center">
            <FaBookOpen className="w-6 h-6 mr-4" />
            My Article
          </h2>
          <div className="border border-white bg-white rounded-[10px] py-1 px-2 flex items-center w-[20%] mr-6">
            <span
              onClick={() => {
                // setSearchWord(searchRef.current.value);
              }}
              className=" text-minionBlue hover:cursor-pointer pr-3"
            >
              <FaSearch />
            </span>
            <input
              type="text"
              ref={searchRef}
              name=""
              onChange={(e) => {
                e.target.value ? setFlag(true) : setFlag(false);
              }}
              // onKeyUp={(e) => {
              //   if (e.keyCode === 13) setSearchWord(searchRef.current.value);
              // }}
              className="outline-none bg-transparent w-[140px] text-minionBlue "
              placeholder="Search..."
            />
            <span
              onClick={(e) => {
                // initSearch(e.target.id);
              }}
              className={`text-xl  text-minionBlue ${
                flag === true ? `visible hover:cursor-pointer` : "invisible "
              }`}
            >
              x
            </span>
          </div>
        </div>

        {showData?.map((item, key) => {
          console.log(item);
          return (
            <div className=" mt-4 ml-4" key={key}>
              <div className="flex overflow-auto w-[95%] justify-between items-center pb-1 border-b-[1px] border-b-gray-300">
                <div className="flex w-full items-center">
                  <img
                    className=" w-12 h-12 rounded-lg ml-4"
                    src={
                      userAvatar?.length
                        ? process.env.REACT_APP_API_BASE_URL +
                          "/api/file/download/" +
                          userAvatar[0]
                        : "/image/avatar.png"
                    }
                  />
                  <div className=" ml-4 w-[20%] ">
                    <h2 className="font-bold ">{item?.title}</h2>
                    <p className="  text-minionBlue">{item?.categoryTitle}</p>
                  </div>
                  <div className=" ml-6  ">
                    <h2
                      className=" text-sm w-[300px] truncate inline-block font-impact"
                      dangerouslySetInnerHTML={{ __html: item?.description }}
                    ></h2>
                  </div>

                  <div className=" ml-6 ">
                    <p className=" flex">
                      <ClockIcon className="w-6 h-6 mr-2" />
                      {moment(item?.createdAt).fromNow(false)}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-center bg-white border-minionBlue border rounded-md pr-4 pl-4 h-8 mr-4">
                    <HandThumbUpIcon className='"w-6 h-6  text-minionBlue mr-2 ' />
                    <h2 className="font-bold text-center text-minionBlue">
                      {item?.like?.length}
                    </h2>
                  </div>
                  <div className="ml-1 flex items-center bg-minionBlue rounded-md pr-4 pl-4 h-8 mr-4">
                    <EyeIcon className='"w-6 h-6  text-white mr-2 ' />
                    <h2 className="font-bold text-center text-white">
                      {item?.view?.length}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default ProductHistory;
