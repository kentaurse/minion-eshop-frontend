import React from "react";
import { FaDolly, FaCoins, FaBookOpen } from "react-icons/fa";

const CoinCharge = ({ userProfile, coin }) => {
  return (
    <>
      <div className="w-full bg-white h-[250px] rounded-xl shadow-lg flex mt-4">
        <div className="flex w-full mr-6 justify-between gap-4 ">
          <div className="w-[66%]  border-r-[2px] border-minionBlue">
            <h2 className="font-bold text-2xl text-center items-center  mt-10 text-minionBlue">
              Coin Charge Request
            </h2>
            <div className="mt-10 flex flex-col justify-center items-center w-full">
              <input
                type="number"
                placeholder="Coin Charge..."
                className="border-[1px] w-[60%] bg-white  border-minionBlue font-satoshi text-xl focus:outline-none text-gray-700 focus:border-minionBlue px-4 py-1 rounded-md"
                // onChange={(e) => updatePrdData(e.target.value, e.target.id)}
              />
              <div>
                <button className=" bg-minionBlue mt-6 p-2 text-md text-white rounded-md hover:bg-white hover:text-minionBlue hover:border-minionBlue border ">
                  Request
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[33%] justify-center items-center ">
            <FaCoins className="w-[50%] h-[50%] rounded-md bg-minionBlue p-6  text-white" />
            <h2 className="text-2xl font-bold ">${coin}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoinCharge;
