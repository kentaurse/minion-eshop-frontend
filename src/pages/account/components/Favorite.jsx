import React from "react";
import { FaDollarSign, FaRegHeart } from "react-icons/fa";

const Favorite = () => {
  return (
    <>
      <div className="w-full bg-white h-[500px] rounded-xl shadow-lg">
        <div className="flex justify-between items-center pb-4 bg-minionBlue rounded-t-lg">
          <h2 className=" text-lg pt-6 pl-6 font-bold text-white">
            My Favorite Products
          </h2>
          <h2 className=" text-lg pt-6 pl-6 pr-6 text-white ">12</h2>
        </div>
        <div className="mt-4 ml-4 overflow-auto w-[95%] flex justify-between items-center pb-1 border-b-[1px] border-b-gray-300 ">
          <div className="flex w-full items-center">
            <img
              className=" w-12 h-12 rounded-lg ml-4"
              src={
                // item?._id?.avatar?.length
                //   ? process.env.REACT_APP_API_BASE_URL +
                //     "/api/file/download/" +
                //     item?._id?.avatar[0]
                //   :
                "/image/avatar.png"
              }
            />
            <div className=" ml-4 w-[40%] ">
              <h2 className="font-bold ">This is Title</h2>
              <p>This is content</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-minionBlue rounded-md text-white pr-2 pl-1 h-6 mr-4">
              <FaDollarSign /> <span>10000</span>
            </div>
            <div className="flex items-center bg-slate-200 rounded-full justify-center text-minionBlue  p-2 mr-4 text-lg">
              <FaRegHeart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Favorite;
