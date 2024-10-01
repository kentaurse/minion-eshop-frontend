import React from "react";
import {
  FaAngleLeft,
  FaAngleDoubleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

const initial_val = [3, 6, 10];
const Pagination = (props) => {
  return (
    <>
      <div className="flex gap-2 text-white text-xl w-full sm:w-[unset]">
        {Math.ceil(props?.page / props?.perpage) > 0 ? (
          <div
            className="hidden sm:flex flex-row items-center text-lg bg-minionBlue text-white hover:bg-white hover:text-minionBlue border-minionBlue border
                                    rounded px-2 duration-300 cursor-pointer justify-center"
            onClick={() => props?.choose(0)}
          >
            <FaAngleDoubleLeft />
          </div>
        ) : (
          <div className="flex flex-row px-2 items-center text-lg bg-gray-300 rounded duration-300 justify-center">
            <FaAngleDoubleLeft />
          </div>
        )}

        {Math.ceil(props?.page / props?.perpage) > 0 ? (
          <div
            className="flex flex-row items-center text-lg bg-minionBlue text-white hover:bg-white hover:text-minionBlue border-minionBlue border 
                                    rounded duration-300  justify-center px-2  
                                    cursor-pointer "
            onClick={() =>
              props?.choose(
                props?.page - props?.perpage < 0 ? 0 : props?.page - props?.perpage
              )
            }
          >
            <FaAngleLeft />
          </div>
        ) : (
          <div className="flex flex-row items-center text-lg bg-gray-300 rounded px-2 duration-300 ">
            <FaAngleLeft />
          </div>
        )}
        <select
          className="ml-0 border-[1px] font-sans text-xl focus:outline-none lg:w-20 md:w-20 text-minionBlue border-minionBlue px-2 py-1 rounded-md duration-300"
          name="page"
          onChange={(e) => props?.choose(Number(e.target?.value))}
          value={Math.ceil(props?.page / props?.perpage) * props?.perpage}
        >
          {props?.total > props?.perpage ? (
            new Array(Math.ceil(props?.total / props?.perpage))
              .fill("0")
              .map((item, index) => {
                let select =
                  Math.ceil(props?.page / props?.perpage) === index
                    ? "selected"
                    : "";
                return (
                  <option
                    key={index}
                    value={(index + 1) * props?.perpage - props?.perpage}
                  >
                    {index + 1}
                  </option>
                );
              })
          ) : (
            <option value={0}>1</option>
          )}
        </select>
        {props?.page + props?.perpage < props?.total ? (
          <div
            className="flex flex-row items-center text-lg bg-minionBlue text-white hover:bg-white hover:text-minionBlue border-minionBlue border rounded duration-300 cursor-pointer  px-2 "
            onClick={() => props?.choose(props?.page + props?.perpage)}
          >
            {" "}
            <FaAngleRight />
          </div>
        ) : (
          <div className="flex flex-row items-center text-lg bg-gray-300 rounded px-2 duration-300">
            <FaAngleRight />
          </div>
        )}
        {props?.page + props?.perpage < props?.total ? (
          <div
            className="flex flex-row items-center text-lg bg-minionBlue text-white hover:bg-white hover:text-minionBlue border-minionBlue border rounded px-2 duration-300 cursor-pointer "
            onClick={() =>
              props?.choose(
                (Math.ceil(props?.total / props?.perpage) - 1) * props?.perpage
              )
            }
          >
            {" "}
            <FaAngleDoubleRight />
          </div>
        ) : (
          <div className="hidden sm:flex flex-row items-center text-lg bg-gray-300 rounded px-2 duration-300">
            <FaAngleDoubleRight />
          </div>
        )}
        <select
          className="bg-minionBlue text-white hover:bg-white hover:text-minionBlue border-minionBlue ml-0 sm:ml-16 border-[1px] font-sans text-xl focus:outline-none md:w-20  px-2 rounded-md"
          name="page"
          value={props?.perpage}
          onChange={(e) => props?.setPerpage(Number(e.target?.value))}
        >
          {props?.initialPage
            ? props?.initialPage.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))
            : initial_val.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
        </select>
      </div>
    </>
  );
};

export default Pagination;
