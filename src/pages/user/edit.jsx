import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { userProfile } from "../../components/Const";
import { Link } from "react-router-dom";
import bgImg from "../../assets/image/Path 26.png";
import { useSelector } from "react-redux";

export default function Edit() {
  const [searchParams] = useSearchParams();
  // const [userProfile, SetUserProfile] = useState([]);

  // useEffect(() => {

  // },[searchParams.get('id')])

  return (
    <>

      <div className="bg-white rounded-md shadow-md px-[2rem] py-[2rem] mx-4 min-h-full">
        <div className="container mx-auto">
          <div className="relative text-lg font-times rounded-[10px]">
            <div className=" flex flex-row justify-between items-center min-h-[calc(100vh-400px)] ">
              <div className="w-[50%] flex justify-center py-10 border-r-[2px] border-minionBlue">
                <div className="max-w-[380px] max-h-[380px] w-[90%] aspect-[1/1] border border-minionBlue rounded-[10px] p-[10px]">
                  <img
                    src={userProfile.userAvatar}
                    alt=""
                    className="object-contain w-[100%] h-[100%]"
                  />
                </div>
              </div>
              <div className="w-[50%] flex justify-center">
                <div className="inline-block text-2xl">
                  <p className="text-4xl text-minionRed mb-20 -mt-20 ml-[-30%]">
                    {userProfile.userName}
                  </p>
                  <p className="mb-3">
                    Created: &nbsp;&nbsp; {userProfile.createDate}{" "}
                  </p>
                  <p className="mb-3">
                    Email: &nbsp;&nbsp;{userProfile.userEmail}{" "}
                  </p>
                  <p className="mb-3">
                    Phond: &nbsp;&nbsp;{userProfile.userPhoneNumber}{" "}
                  </p>
                  <p className="mb-3">
                    Payed: &nbsp;&nbsp;
                    <span className="text-2xl text-minionRed font-impact">
                      {userProfile.totalPayed}
                    </span>{" "}
                  </p>
                  <p className="">Role: &nbsp;&nbsp;{userProfile.role} </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end my-4 items-center">
              <Link
                to={`/order?user=${searchParams.get("id")}`}
                className=" flex justify-center items-center gap-1 px-4 py-2 hover:text-minionBlue hover:bg-white border-[1px] border-minionBlue font-sans  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out"
              >
                {" "}
                View Order
              </Link>
              <Link
                to={`/user`}
                className="w-28 flex justify-center items-center gap-1 px-4 py-2 hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans rounded-md  mx-2 text-white bg-minionRed duration-300 ease-out"
              >
                Go Back
              </Link>
            </div>
            {/* <div className="absolute z-[-1] right-0 bottom-0 rounded-[10px]">
              <img src={bgImg} alt="" />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
