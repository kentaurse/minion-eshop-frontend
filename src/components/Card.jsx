import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rate from "./Rate";
// import { showData } from "./Const";
import { FaAngleLeft, FaAngleRight, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Card({ title, showData }) {
  const [id, setId] = useState(0);
  const [nextItem, setNextItem] = useState(true);
  const [prevItem, setPrevItem] = useState(false);
  const [count, setCount] = useState(false);
  const [flag, setFlag] = useState(false);

  const next = () => {
    if (id < Object.keys(showData).length) {
      setId(id + 1);
    }

    if (id === Object.keys(showData).length - 2) {
      setCount(true);
    }
    if (id !== 1) {
      setPrevItem(true);
    }
  };

  useEffect(() => {
    if (count) {
      setNextItem(!nextItem);
      setCount(false);
    }
    if (flag) {
      setPrevItem(!prevItem);
      setFlag(false);
    }
  }, [count, flag]);

  const prev = () => {
    if (id < Object.keys(showData).length) {
      setId(id - 1);
    }
    if (id === 1) {
      setFlag(true);
    }
    if (id !== Object.keys(showData).length) {
      setNextItem(true);
    }
  };

  return (
    <div className=" w-full  bg-white shadow-md flex flex-col items-center rounded-[12px] py-4">
      <p className="text-center text-[20px] pt-[15px] font-bold text-gray-500 mb-4">
        {title}
      </p>
      <div className=" flex overflow-hidden duration-500">
        <div
          key={showData[id].id}
          className="flex justify-between sm:gap-20 xl:gap-1  items-center"
        >
          <div className="pl-[20px] text-[40px]">
            {prevItem === true ? (
              <button onClick={() => prev()}>
                <FaAngleLeft className="text-minionBlue" />
              </button>
            ) : (
              <button className="text-gray-500">
                <FaAngleLeft />
              </button>
            )}
          </div>
          <div className="relative flex flex-col items-center w-fit bg-white bg-clip-border p-3 px-0 text-center  transition-all">
            <div className="overflow-hidden w-[175px] h-[175px] rounded-lg">
              <div className="m-auto">
                <img
                  className=" sm:w-[175px] sm:h-[175px] hover:scale-125 duration-300 ease-out"
                  src={showData[id].img}
                  alt="minion"
                />
              </div>
            </div>
            <div className="">
              <p className="text-gray-500 text-[24px] break-words w-52 sm:w-64  pt-8 p-3 px-0">
               
                {showData[id].store}
              </p>
              
              <p className="text-minionBlue break-words w-52 sm:w-64 font-bold text-[30px] pb-8 p-3 px-0">
                {showData[id].name}
              </p>
            </div>
            <div>
              <Link to={`detail?${showData[id].id}`}>
                <button className="font-sans flex items-center gap-2 text-2xl mt-2 hover:text-minionBlue rounded-lg hover:bg-white hover:border-minionBlue  border border-white duration-300 ease-linear px-4 py-2 text-white bg-minionBlue">
                   <span className="mt-1"> <FaEye></FaEye></span> view users
                </button>
              </Link>
            </div>
          </div>
          <div className="pr-[12px] sm:pr-[30px] text-[40px]">
            {nextItem === true ? (
              <button onClick={() => next()}>
                <FaAngleRight className="text-minionBlue" />
              </button>
            ) : (
              <button disabled className="text-gray-500">
                <FaAngleRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
