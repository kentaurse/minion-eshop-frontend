import { Tooltip } from "antd";
import React from "react";
import {
  FaDollarSign,
  FaHackerrank,
  FaShoppingBag,
  FaUserFriends,
} from "react-icons/fa";

const Cart = ({ title, total, current, state }) => {
  return (
    <div className="bg-white flex items-center justify-center gap-6 shadow-md w-full xl:flex h-[215px] py-5  px-8 rounded-xl">
      <span className="text-minionBlue text-3xl p-3 bg-minionLightBlue rounded-full">
        {state == 1 && <FaShoppingBag></FaShoppingBag>}
        {state == 2 && <FaDollarSign></FaDollarSign>}
        {state == 3 && <FaUserFriends></FaUserFriends>}
        {state == 4 && <FaHackerrank></FaHackerrank>}
      </span>
      <Tooltip
        overlayInnerStyle={{ width: "200px", padding: "12px" }}
        placement="bottom"
        title={() => {
          return (
            <>
              <div className="text-white-600 flex justify-between">
                <span className=" text-minionBlue">
                  Total:{" "}
                  <span className="text-white ml-4">
                    {state % 2 == 0 && "$"}
                    {total}
                  </span>{" "}
                </span>
              </div>
              <div className="text-white-600 flex justify-between">
                <span className=" text-minionBlue">
                  Current:{" "}
                  <span className="text-white ml-4">
                    {state % 2 == 0 && "$"}
                    {current}
                  </span>{" "}
                </span>
              </div>
            </>
          );
        }}
      >
        <div>
          <h3 className="mt-4 text-gray-500 text-2xl  gap-2 justify-center">
            {title}
          </h3>
          <div className="flex mt-4 justify-center">
            <div>
              <label
                className="text-minionBlack font-bold text-lg"
                htmlFor="total"
              >
                Total
              </label>

              <h4 className="ping-text1 mt-4 text-gray-400 text-3xl font-bold md:border-r-8 md:border-r-gray-400 md:pr-4 md:mr-6">
                {state % 2 == 0 && "$"}
                {total / 10000 > 1 ? Math.round(total / 1000) + "K" : total}
              </h4>
            </div>
            <div className="flex flex-col justify-start">
              <label
                className="text-minionBlack font-bold text-lg"
                htmlFor="total"
              >
                Current
              </label>
              <h4 className="ping-text mt-3 w-32 text-minionBlue text-4xl font-bold ">
                {state % 2 == 0 && "$"}
                {current / 10000 > 1
                  ? Math.round(current / 1000) + "K"
                  : current}
              </h4>
            </div>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};
export default Cart;
