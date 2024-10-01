import React, { useState, useEffect } from "react";
import bgImg from "../../assets/image/bgIMG.png";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../../redux/userSlice";
import Loader from "../../components/Loader";
import { FaEye, FaLock, FaTabletAlt } from "react-icons/fa";

export default function Register() {
  const initial_register_obj = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "user",
    conf_paw: "",
  };

  const [registerObj, setRegisterObj] = useState(initial_register_obj);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateInputValue = (value, id) => {
    setRegisterObj({ ...registerObj, [id]: value });
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (registerObj.email.trim() === "")
      return setErrorMessage("Email is required!");
    if (registerObj.email.trim() !== "" && registerObj.email.search("@") === -1)
      return setErrorMessage("Please include an '@' in the email address");
    if (registerObj.firstName.trim() === "")
      return setErrorMessage("FirstName is required!");
    if (registerObj.lastName.trim() === "")
      return setErrorMessage("LastName is required!");
    if (registerObj.password.trim() === "")
      return setErrorMessage("Password is required!");
    if (
      registerObj.password.trim() !== "" &&
      (registerObj.password.length < 8 ||
        registerObj.password.search(/[A-Z]/) === -1)
    )
      return setErrorMessage(
        "Please input more 8 size and include capital letter"
      );
    if (registerObj.conf_paw.trim() === "")
      return setErrorMessage("ConfirmPassword is required!");
    if (registerObj.password !== registerObj.conf_paw)
      return setErrorMessage("Passwords does not match!");
    else {
      setLoading(true);
      const res = await dispatch(signup(registerObj));
      setLoading(false);
      setErrorMessage(res?.payload?.message);
      if (!res?.payload?.error)
        setTimeout(() => {
          navigate("/login");
        }, 500);
    }
  };

  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute top-0 right-0 z-[-1]">
          <img
            src={bgImg}
            alt="minion shop"
            className="w-full h-full object-center"
          />
        </div>
        <form
          onSubmit={onSubmit}
          className="absolute top-[50%] left-[50%] font-satoshi rounded-2xl -translate-x-1/2 -translate-y-1/2 w-[500px] min-h-[700px] shadow-md  bg-white  px-20 pt-20 pb-12"
        >
          <div className="flex items-center gap-3 justify-center">
            <img
              src="/logo.svg"
              alt="Logo"
              className="logo-animate w-14 h-14"
            />
            <p className="text-center text-4xl text-gray-700">Sign Up</p>
          </div>
          <p className="pt-8">
            <label
              htmlFor="email"
              className="block text-gray-700 text-xl font-normal mb-2"
            >
              Email<span className="text-minionRed ml-5">*</span>
            </label>
            <div className="relative">
              <input
                onChange={(e) => {
                  updateInputValue(e.target.value, e.target.id);
                }}
                type="text"
                name="email"
                id="email"
                placeholder="gru.lucy@gmial.com"
                className="border border-white focus:border-minionBlue  bg-gray-100 text-gray-700 placeholder:text-gray-400 rounded-md w-full py-2 pl-6 text-xl font-normal outline-none  "
              />
              <span className="absolute top-3 right-2 text-xl text-gray-400">
                <FaTabletAlt />
              </span>
            </div>
          </p>
          <p className="pt-8 flex flex-row justify-between">
            <span className="w-[48%]">
              <label
                htmlFor="firstName"
                className="block text-gray-700 text-xl font-normal mb-2"
              >
                FirstName<span className="text-minionRed ml-5">*</span>
              </label>
              <input
                onChange={(e) => {
                  updateInputValue(e.target.value, e.target.id);
                }}
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Gru"
                className="border-[1px] border-white focus:border-minionBlue  bg-gray-100 text-gray-700 placeholder:text-gray-400 rounded-md w-full py-2 pl-6 text-xl font-normal outline-none  "
              />
            </span>
            <span className="w-[48%]">
              <label
                htmlFor="lastName"
                className="block text-gray-700 text-xl font-normal mb-2"
              >
                Last Name<span className="text-minionRed ml-5">*</span>
              </label>
              <input
                onChange={(e) => {
                  updateInputValue(e.target.value, e.target.id);
                }}
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Stuwate"
                className="border border-white focus:border-minionBlue  bg-gray-100 text-gray-700 placeholder:text-gray-400 rounded-md w-full py-2 pl-6 text-xl font-normal outline-none  "
              />
            </span>
          </p>
          <p className="pt-8">
            <label
              htmlFor="password"
              className="block text-gray-700 text-xl font-normal mb-2"
            >
              Password<span className="text-minionRed ml-5">*</span>
            </label>
            <span className="relative">
              <input
                onChange={(e) => {
                  updateInputValue(e.target.value, e.target.id);
                }}
                type={eye ? "text" : "password"}
                name="password"
                id="password"
                placeholder="8+ Characters, 1 Capital "
                className="border border-white focus:border-minionBlue  bg-gray-100 text-gray-700 placeholder:text-gray-400 rounded-md w-full py-2 pl-6 text-xl font-normal outline-none  "
              />
              <span
                onMouseUp={() => setEye(false)}
                onMouseDown={() => setEye(true)}
                className="absolute top-0 right-2 text-xl font-normal text-gray-400"
              >
                <FaLock />
              </span>
            </span>
          </p>
          <p className="pt-8">
            <label
              htmlFor="conf_paw"
              className="block text-gray-700 text-xl font-normal mb-2"
            >
              Confirm Password<span className="text-minionRed ml-5">*</span>
            </label>
            <span className="relative">
              <input
                onChange={(e) => {
                  updateInputValue(e.target.value, e.target.id);
                }}
                type={eye ? "text" : "password"}
                name="conf_paw"
                id="conf_paw"
                placeholder="Confirm"
                className="border border-white focus:border-minionBlue  bg-gray-100 text-gray-700 placeholder:text-gray-400 rounded-md w-full py-2 pl-6 text-xl font-normal outline-none  "
              />
              <span
                onMouseUp={() => setEye(false)}
                onMouseDown={() => setEye(true)}
                className="absolute top-0 right-2 text-xl font-normal text-gray-400"
              >
                <FaLock />
              </span>
            </span>
          </p>
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="w-full items-center gap-1 px-4 py-2 text-white bg-minionBlue border-[1px] border-minionBlue font-satoshi rounded-md  mx-2 hover:text-minionBlue hover:bg-white duration-300 ease-out"
            >
              Submit
            </button>
          </div>
          <p
            className={`text-xl font-normal mt-2 text-minionRed text-center duration-300 ease-out `}
          >
            {errorMessage}
          </p>
          <p className="text-xl font-normal text-gray-700 text-center mt-3">
            Already have an account?
            <Link
              to={`/login`}
              className="underline hover:text-minionRed text-minionBlue pl-2"
            >
              Sign In
            </Link>
          </p>
        </form>
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
