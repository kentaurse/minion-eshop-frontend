import { useEffect, useState } from "react";
import bgImg from "../../assets/image/bgIMG.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetError, signin } from "../../redux/userSlice";
import Loader from "../../components/Loader";
import {
  FaEye,
  FaLock,
  FaLockOpen,
  FaMailchimp,
  FaTabletAlt,
} from "react-icons/fa";
import { LockOutlined } from "@ant-design/icons";
import { MessageOutlined } from "@ant-design/icons";

export default function LogIn() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState(false);
  const { token, error } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const init_pass = {
    email: "",
    password: "",
  };

  const [loginObj, setLoginObj] = useState(init_pass);

  const updateInputValue = (value, id) => {
    setLoginObj({ ...loginObj, [id]: value });
  };

  useEffect(() => {
    setErrorMessage(errorMessage);
    !loading &&
      setTimeout(() => {
        dispatch(resetError());
        setErrorMessage("");
      }, 3000);
  }, [errorMessage]);

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token]);

  useEffect(() => {
    if (loading == true) {
      setErrorMessage("Loding...");
    }
  }, [loading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loginObj.email.trim() === "")
      return setErrorMessage("Email is required!");
    if (loginObj.email.trim() !== "" && loginObj.email.search("@") === -1)
      return setErrorMessage("Please include an '@' in the email address");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Password is required!");
    else {
      setLoading(true);
      const res = await dispatch(signin(loginObj));
      setLoading(false);
      setErrorMessage(res?.payload?.message);
    }
  };
  console.log(eye);
  return (
    <>
      <div className={` ${loading && "blur-[2px]"} relative min-h-screen`}>
        <div className="absolute top-0 right-0 z-[-1]">
          <img
            src={bgImg}
            alt="minion shop"
            className="w-full h-full object-center"
          />
        </div>
        <form
          onSubmit={onSubmit}
          className="absolute top-[50%] left-[50%] font-satoshi  -translate-x-1/2 -translate-y-1/2 w-[500px] min-h-[550px] shadow-md bg-white  rounded-2xl  px-20 pt-20 pb-12"
        >
          <div className="flex items-center gap-3 justify-center">
            <img
              src="/logo.svg"
              alt="Logo"
              className="logo-animate w-14 h-14"
            />
            <p className="text-center text-4xl text-gray-700">Sign In</p>
          </div>
          <p className="pt-8">
            <label htmlFor="email" className="block text-gray-700 text-xl mb-2">
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
                placeholder="ex:Admin@gmial.com"
                className="border border-white foucs:border-minionBlue bg-gray-100 text-gray-700 placeholder:text-gray-500  rounded-md w-full py-2 pl-6 text-xl outline-minionBlue  shadow-minionBlue"
              />
              <span
                onMouseUp={() => setEye(false)}
                onMouseDown={() => setEye(true)}
                className="absolute top-3 right-2 text-xl text-gray-400"
              >
                <FaTabletAlt />
              </span>
            </div>
          </p>
          <p className="pt-8">
            <label
              htmlFor="password"
              className="block text-gray-700 text-xl mb-2"
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
                placeholder="Enter your password more than 8"
                className="border border-white foucs:border-minionBlue bg-gray-100  text-gray-700 placeholder:text-gray-500  rounded-md w-full py-2 pl-6 text-xl outline-minionBlue shadow-minionBlue"
              />
              <span
                onMouseUp={() => setEye(false)}
                onMouseDown={() => setEye(true)}
                className="absolute top-0 right-2 text-xl text-gray-400"
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
              Sign In
            </button>
          </div>
          <p
            className={`text-xl mt-2 text-minionRed text-center duration-300 ease-out `}
          >
            {errorMessage}
          </p>
          <p className="text-xl text-gray-700 text-center mt-3">
            You don't have account?
            <Link
              to={`/register`}
              className="underline hover:text-minionRed text-minionBlue pl-2"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full" id="loading">
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-[2]">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
}
