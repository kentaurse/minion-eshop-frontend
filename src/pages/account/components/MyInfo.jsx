import React from "react";
import { FaDolly, FaCoins, FaBookOpen } from "react-icons/fa";

const MyInfo = ({ userProfile, user, productNum, articleNum }) => {
  return (
    <>
      <div className="w-full bg-white h-[300px] rounded-xl shadow-lg flex mt-4">
        <div className="w-[50%] divide-gray-200 flex flex-col justify-center items-center  border-r-[2px] border-gray-200 ">
          <img
            src={
              user?.avatar[0]
                ? process.env.REACT_APP_API_BASE_URL +
                  "/api/file/download/" +
                  user?.avatar[0]
                : "/image/avatar.png"
            }
            alt="avatar"
            className="rounded-lg w-[40%]  "
          />
          <h2 className="font-bold mt-2 text-xl">{user?.firstName}</h2>
          <p>{user?.email}</p>
        </div>
        <div className="w-[50%]  flex-col  m-auto  items-center">
          <div className="flex items-center gap-4 mb-4">
            <FaCoins className="w-12 h-12 rounded-md bg-pink-500 p-2 ml-[15%] text-white" />
            Current Coin:
            <h2 className="text-xl font-bold">${user?.money}</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <FaDolly className="w-12 h-12 rounded-md bg-pink-500 p-2 ml-[15%] text-white" />
            Brought Products:
            <h2 className="text-xl font-bold">{productNum}</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <FaBookOpen className="w-12 h-12 rounded-md bg-pink-500 p-2 ml-[15%] text-white" />
            Current Articles:
            <h2 className="text-xl font-bold">{articleNum}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyInfo;
