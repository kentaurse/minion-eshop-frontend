import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile, getUser } from "../redux/userSlice";
import { FaSave, FaTrash } from "react-icons/fa";
import defaultAvatar from "../assets/image/avatar.png";
import Loader from "../components/Loader";
import axios from "axios";
import { showNotification } from "../redux/headerSlice";

export default function Account() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/notFound");
    }
  }, [navigate]);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const [userProfile, setUserProfile] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [avatarURL, setAvatarURL] = useState(defaultAvatar);
  const updateInputValue = (value, id) => {
    setUserProfile({ ...userProfile, [id]: value });
    console.log(setUserProfile({ ...userProfile, [id]: value }));
  };

  useEffect(() => {
    if (user?.avatar[0]) {
      setAvatarURL(
        `${
          process.env.REACT_APP_API_BASE_URL +
          "/api/file/download/" +
          user?.avatar
        }`
      );
    }

    user &&
      setUserProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        money: user.money,
        bio: user.bio || "",
        birthday: user.birthday,
        phone: user.phone || "",
        files: user.avatar || [],
      });
  }, [user]);

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
    console.log(userProfile);
    if (userProfile.firstName.trim() === "")
      return setErrorMessage("FirstName is required!");
    if (userProfile.lastName.trim() === "")
      return setErrorMessage("LastName is required!");
    if (userProfile.email.trim() === "")
      return setErrorMessage("Email is required!");
    if (userProfile.email.trim() !== "" && userProfile.email.search("@") === -1)
      return setErrorMessage("Please include an '@' in the email address");
    if (
      userProfile.phone.trim() !== "" &&
      (userProfile.phone.search(/[a-z]/i) !== -1 ||
        userProfile.phone.length !== 10)
    )
      return setErrorMessage("Please check out your phone format");
    else {
      setLoading(true);
      let fileIdList = userProfile.files;
      if (imageFile) {
        const data = await updateAvartar();
        fileIdList = data?.uploaded.map((item) => {
          return item?._id;
        });
      }
      const res = await dispatch(
        updateUserProfile({ ...userProfile, files: fileIdList })
      );
      setLoading(false);
      if (!res?.payload?.error) {
        dispatch(
          showNotification({ message: res?.payload?.message, status: 1 })
        );
      } else {
        dispatch(showNotification({ message: res?.payload?.error, status: 0 }));
      }

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
    }
  };
  const updateAvartar = async () => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const { data } = await axios.post(
      process.env.REACT_APP_API_BASE_URL + "/api/file/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
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
                    src={avatarURL}
                    alt=""
                    className="object-cover w-[100%] h-[100%] rounded-full"
                  />
                  <input
                    onChange={(e) => {
                      setImageFile(e.target.files[0]);
                      setAvatarURL(URL.createObjectURL(e.target.files[0]));
                    }}
                    type="file"
                    name="avatar"
                    id="avatar"
                    hidden
                  />
                </label>
              </div>
            </div>
            <div className="w-[60%] flex justify-center px-6 pt-12">
              <div className="inline-block text-2xl">
                <p className="flex flex-row justify-between">
                  <span className="w-[48%]">
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 text-xl"
                    >
                      FirstName<span className="text-minionRed ml-3">*</span>
                    </label>
                    <input
                      onChange={(e) => {
                        updateInputValue(e.target.value, e.target.id);
                      }}
                      defaultValue={userProfile?.firstName}
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="ex:Gru"
                      className="  text-gray-700 border border-white focus:border-minionBlue  bg-gray-100 rounded-md w-full py-2 pl-6 text-xl outline-none"
                    />
                  </span>
                  <span className="w-[48%]">
                    <label
                      htmlFor="lastName"
                      className="block text-gray-700 text-xl"
                    >
                      Last Name<span className="text-minionRed ml-3">*</span>
                    </label>
                    <input
                      onChange={(e) => {
                        updateInputValue(e.target.value, e.target.id);
                      }}
                      defaultValue={userProfile?.lastName}
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="ex:Stuwate"
                      className=" border-white border focus:border-minionBlue  bg-gray-100 text-gray-700 placeholder:text-gray-700 placeholder:opacity-50 rounded-md w-full py-2 pl-6 text-xl outline-none "
                    />
                  </span>
                </p>
                <p className="pt-5">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-xl"
                  >
                    Email<span className="text-minionRed ml-3">*</span>
                  </label>
                  <input
                    onChange={(e) => {
                      updateInputValue(e.target.value, e.target.id);
                    }}
                    defaultValue={userProfile?.email}
                    type="text"
                    name="email"
                    id="email"
                    placeholder="ex:gru.lucy@gmial.com"
                    className=" border-white border focus:border-minionBlue  bg-gray-100  text-gray-700 placeholder:text-gray-700 placeholder:opacity-50 rounded-md w-full py-2 pl-6 text-xl outline-none  "
                  />
                </p>
                <p className="pt-5">
                  <label
                    htmlFor="birthday"
                    className="block text-gray-700 text-xl"
                  >
                    Brithday<span className="text-minionRed ml-3"></span>
                  </label>
                  <input
                    onChange={(e) => {
                      updateInputValue(e.target.value, e.target.id);
                    }}
                    defaultValue={userProfile?.birthday}
                    type="date"
                    name="birthday"
                    id="birthday"
                    className=" border-white border focus:border-minionBlue  bg-gray-100  text-gray-700 placeholder:text-gray-700 placeholder:opacity-50 rounded-md w-full py-2 pl-6 text-xl outline-none  "
                  />
                </p>
                <p className="pt-5">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 text-xl"
                  >
                    Phone Number<span className="text-minionRed ml-3"></span>
                  </label>
                  <input
                    onChange={(e) => {
                      updateInputValue(e.target.value, e.target.id);
                    }}
                    defaultValue={userProfile?.phone}
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="0123456789"
                    className=" border-white border focus:border-minionBlue  bg-gray-100  text-gray-700 placeholder:text-gray-700 placeholder:opacity-50 rounded-md w-full py-2 pl-6 text-xl outline-none  "
                  />
                </p>
                {user.role == "admin" ? (
                  <p className="pt-5">
                    <label
                      htmlFor="money"
                      className="block text-gray-700 text-xl"
                    >
                      Money<span className="text-minionRed ml-3"></span>
                    </label>
                    <input
                      onChange={(e) => {
                        updateInputValue(e.target.value, e.target.id);
                      }}
                      defaultValue={userProfile?.money}
                      type="number"
                      name="money"
                      id="money"
                      disabled={false}
                      className=" border-white border focus:border-minionBlue  bg-gray-100  text-gray-700 placeholder:text-gray-700 placeholder:opacity-50 rounded-md w-full py-2 pl-6 text-xl outline-none  "
                    />
                  </p>
                ) : (
                  <p className="pt-5">
                    <label
                      htmlFor="money"
                      className="block text-gray-700 text-xl"
                    >
                      Money<span className="text-minionRed ml-3"></span>
                    </label>
                    <input
                      onChange={(e) => {
                        updateInputValue(e.target.value, e.target.id);
                      }}
                      defaultValue={userProfile?.money}
                      type="number"
                      name="money"
                      id="money"
                      disabled={true}
                      className=" border-white border focus:border-minionBlue  bg-gray-100  text-gray-700 placeholder:text-gray-700 placeholder:opacity-50 rounded-md w-full py-2 pl-6 text-xl outline-none  "
                    />
                  </p>
                )}
                <p className="pt-5">
                  <label htmlFor="bio" className="block text-gray-700 text-xl">
                    Bio<span className="text-minionRed ml-3"></span>
                  </label>
                  <textarea
                    onChange={(e) => {
                      updateInputValue(e.target.value, e.target.id);
                    }}
                    defaultValue={userProfile?.bio}
                    type="text"
                    name="bio"
                    id="bio"
                    placeholder="I'm a ...."
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
                      <FaSave />
                    </span>
                    Save
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
