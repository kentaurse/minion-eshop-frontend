import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { updateUserProfile, getUser } from "../../redux/userSlice";
import { FaSave, FaTrash } from "react-icons/fa";
import defaultAvatar from "../../assets/image/avatar.png";
import Loader from "../../components/Loader";
import axios from "axios";
import { MessageOutlined } from "@ant-design/icons";
import { ClockCircleOutlined } from "@ant-design/icons";
import { NotificationOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { CreditCardOutlined } from "@ant-design/icons";
import { DollarOutlined } from "@ant-design/icons";
import { BookOutlined } from "@ant-design/icons";
import { PoundOutlined } from "@ant-design/icons";
import { CalendarOutlined } from "@ant-design/icons";
import { PhoneOutlined } from "@ant-design/icons";
import { RocketOutlined } from "@ant-design/icons";
import { ShopOutlined } from "@ant-design/icons";
import { showNotification } from "../../redux/headerSlice";
import { useDispatch } from "react-redux";

export default function Account() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const token = localStorage.getItem("token");
  const [userProfile, setUserProfile] = useState();
  const userId = params?.id;
  const getUserInfo = async () => {
    const { data } = await axios.get(
      process.env.REACT_APP_API_BASE_URL + "/api/auth/getUser/" + userId
    );
    setUserProfile(data.user);
  };

  useEffect(() => {
    getUserInfo();
  }, [userId]);
  console.log(userProfile);

  useEffect(() => {
    if (!token) {
      navigate("/notFound");
    }
  }, [navigate]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const updateInputValue = (value, id) => {
    setUserProfile({ ...userProfile, [id]: value });
  };
  useEffect(() => {
    setErrorMessage(errorMessage);
    !loading &&
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
  }, [errorMessage]);

  useEffect(() => {
    if (loading == true) {
      setErrorMessage("Loding...");
    }
  }, [loading]);

  const updateProfile = async () => {
    // setLoading(true);
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/auth/charge/" + userId,
        userProfile
      );
      // setUserProfile(res);
      // setLoading(false);
      dispatch(
        showNotification({
          message: "Success Charge",
          status: 3,
        })
      );
    } catch {
      dispatch(
        showNotification({
          message: "Server is not running correctly!",
          status: 1,
        })
      );
    }
    setErrorMessage(res?.payload?.message);
    if (!res?.payload?.error) {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = token;
        dispatch(getUser());
      }
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  };

  return (
    <>
      <div className=" mt-[10px] h-[86vh] mx-8 overflow-y-auto text-[14px] bg-white shadow-md rounded-[10px] py-10 px-10 pt-16 duration-500 font-satoshi">
        <div className="relative text-lg rounded-[10px]">
          <div className=" flex flex-row justify-between items-center min-h-[calc(100vh-400px)] ">
            <div className="w-[40%] flex justify-center py-10 border-r-[2px] border-gray-200">
              <div className="max-w-[380px] max-h-[380px] w-[90%] aspect-[1/1] shadow-xl border border-gray-200 rounded-full p-[10px]">
                <label htmlFor="avatar">
                  <img
                    src={
                      userProfile?.avatar[0]
                        ? process.env.REACT_APP_API_BASE_URL +
                          "/api/file/download/" +
                          userProfile?.avatar[0]
                        : defaultAvatar
                    }
                    alt="avatar"
                    className="rounded-full w-full h-full"
                  />
                </label>
              </div>
            </div>
            <div className="w-[60%] flex justify-center px-6 pt-12">
              <div className="inline-block text-2xl">
                <p className="mb-6 text-[20px] flex items-center gap-4 text-gray-700">
                  <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                    <UserOutlined /> Name:
                  </span>
                  {userProfile?.firstName + " " + userProfile?.lastName}
                </p>
                <p className="mb-6 text-[20px] flex items-center gap-4 text-gray-700 ">
                  <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                    <ClockCircleOutlined /> Created:
                  </span>
                  {userProfile?.createdAt.toString().slice(0, 10)}
                </p>
                <p className="mb-6 text-[20px] flex items-center gap-4 text-gray-700 ">
                  <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                    <MessageOutlined /> Email:
                  </span>
                  {userProfile?.email}
                </p>
                {userProfile?.birthday && (
                  <p className="mb-6 text-[20px] flex items-center gap-4 text-gray-700 ">
                    <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                      <CalendarOutlined /> Birthday:
                    </span>{" "}
                    {userProfile?.birthday}
                  </p>
                )}
                {userProfile?.role && (
                  <p className="mb-6 text-[20px] flex items-center gap-4 text-gray-700 ">
                    <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                      <RocketOutlined />
                      Role:
                    </span>
                    <span className="text-[20px]  break-all">
                      {userProfile?.role}{" "}
                    </span>
                  </p>
                )}
                {userProfile?.store && (
                  <p className="mb-6 text-[20px] flex items-center gap-4 text-gray-700 ">
                    <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                      <ShopOutlined /> Store:
                    </span>
                    {userProfile?.store?.name}
                  </p>
                )}
                <p className="mb-6 text-[20px] flex items-center gap-4 text-gray-700 ">
                  <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                    <NotificationOutlined /> Permission:
                  </span>
                  {userProfile?.permission ? "True" : "False"}
                </p>
                {userProfile?.phone && (
                  <p className="mb-6 text-[20px] flex items-center gap-4 text-gray-700 ">
                    <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                      <PhoneOutlined /> Phone Number:
                    </span>
                    {userProfile?.phone}
                  </p>
                )}
                {userProfile?.bio && (
                  <p className="mb-6 text-[20px] flex items-start  gap-4 text-gray-700 ">
                    <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                      <BookOutlined /> Bio:
                    </span>
                    <span className="text-[20px] break-all">
                      {userProfile?.bio}
                    </span>
                  </p>
                )}
                <p className="pt-5">
                  <label
                    htmlFor="money"
                    className="block text-gray-700 text-xl"
                  >
                    <span className="text-[20px] w-[132px] gap-2 flex items-center font-normal">
                      <DollarOutlined />
                      Money:
                    </span>
                  </label>
                  <input
                    onChange={(e) => {
                      updateInputValue(e.target.value, e.target.id);
                    }}
                    defaultValue={userProfile?.money}
                    type="number"
                    name="money"
                    id="money"
                    className=" border-white border focus:border-minionBlue  bg-gray-100  text-gray-700 placeholder:text-gray-700 placeholder:opacity-50 rounded-md w-full py-2 pl-6 text-xl outline-none  "
                  />
                </p>

                <p
                  className={`text-xl mt-2 text-minionRed text-center duration-300 ease-out `}
                >
                  {errorMessage}
                </p>
                <div className="flex justify-end my-4 items-center">
                  <button
                    onClick={() => updateProfile()}
                    className="flex justify-center items-center gap-1 px-4 py-2 hover:text-minionBlue hover:bg-white border-[1px] border-minionBlue font-satoshi text-xl rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out"
                  >
                    <span className="pr-2">
                      {" "}
                      <CreditCardOutlined />
                    </span>
                    Charge
                  </button>
                  <Link
                    to={`/app/user`}
                    className=" flex justify-center text-xl items-center gap-1 px-4 py-2 hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-satoshi rounded-md  mx-2 text-white bg-minionRed duration-300 ease-out"
                  >
                    <span className="pr-2">
                      {" "}
                      <FaTrash />
                    </span>
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-[2]">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
}
