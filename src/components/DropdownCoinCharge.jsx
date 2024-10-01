import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showNotification } from "../redux/headerSlice";
import { Modal } from "antd";
import {
  FaCalendar,
  FaCoins,
  FaDollarSign,
  FaHackerrank,
  FaShoppingBag,
  FaUserFriends,
  FaStore,
  FaGoogleWallet,
  FaWallet,
} from "react-icons/fa";
import { getAllUsers, setUserCoin } from "../redux/userSlice";

const DropdownNotification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [allNotification, setAllNotification] = useState([]);
  const [quantity, getQuantity] = useState("");
  const [receiverId, getReceiverId] = useState("");
  const [visible, setVisible] = useState(false);
  const { user } = useSelector((store) => store.user);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const MyId = user?._id;

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });
  const getAll = async () => {
    const res = await dispatch(getAllUsers(""));
    setUserList(res?.payload.userList);
  };
  useEffect(() => {
    getAll();
  }, []);

  const Send = async () => {
    setVisible(false);
    if (user.money >= quantity) {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/auth/coin",
        {
          receiverId,
          quantity,
          MyId,
        }
      );

      await dispatch(setUserCoin(res?.data?.sender));
      if (res?.data?.msg == "Success!") {
        await dispatch(
          showNotification({ message: res?.data?.msg, status: 1 })
        );
      } else {
        showNotification({ message: "Server error", status: 0 });
      }
    } else {
      await dispatch(
        showNotification({ message: "Not enough Coin", status: 0 })
      );
    }
  };

  const open = () => {
    setDropdownOpen(false);
    if (!receiverId) {
      dispatch(
        showNotification({
          message: "Input Other Receiver",
          status: 2,
        })
      );
    }
    if (!quantity) {
      dispatch(
        showNotification({
          message: "Input Coin Quantity",
          status: 0,
        })
      );
    }

    if (receiverId != "" && quantity != "") {
      if (quantity - user?.coin > 0) {
        dispatch(
          showNotification({
            message: "Input Quantity Correctly!",
            status: 0,
          })
        );
      } else {
        setVisible(true);
      }
    }
  };

  return (
    <div className="relative ">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        to="#"
        className="relative"
      >
        <FaCoins className="text-minionBlue text-[25px] " />
      </Link>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        className={`absolute z-50  -right-0 mt-2 flex overflow-auto w-82 flex-col rounded-sm border border-stroke bg-white shadow-default pl-6 pr-6 pb-10  ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <div className="px-4 py-3">
          <h5 className="text-2xl font-satoshi text-center mt-4 ">
            CoinCharge
          </h5>
        </div>
        <ul className="flex h-auto flex-col overflow-y-auto px-1">
          <div className="flex gap-3">
            <label className="w-20 text-xl">Receiver</label>
            <select
              className="input input-bordered border-[1px] h-[30px] w-60 focus:outline-none focus:border-minionBlue font-satoshi text-lg"
              onChange={(e) => getReceiverId(e.target.value)}
            >
              {userList?.map((val, idx) => {
                return (
                  <option
                    key={idx}
                    value={val._id}
                    className="font-satoshi text-lg"
                  >
                    {val.firstName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="divider mt-1 mb-1"></div>

          <div className="flex gap-3">
            <label className="w-20 text-xl">Quantity</label>
            <input
              type="number"
              className="input input-bordered border-[1px] h-[30px] w-60 focus:outline-none focus:border-minionBlue font-sans"
              onChange={(e) => getQuantity(e.target.value)}
            />
          </div>
          <div className="divider mt-1 mb-1"></div>
          <div className="flex gap-3">
            <label className="w-20 text-xl">Remain:</label>
            <text className="input input-bordered h-[30px] dark:bg-base-100 dark:border-slate-600  w-60 focus:outline-none focus:border-minionBlue font-sans">
              ${user?.money}
            </text>
          </div>
          <div className="divider mt-1 mb-2"></div>
          {/* <button
            className="border-[1px] dark:border-slate-600 rounded-md
               p-[1px] hover:tracking-[1px] hover:border-slate-700
                dark:hover:text-blue-300 dark:hover:border-blue-300"
            onClick={() => open()}
          > */}
          <button
            className="border-[1px] bg-minionBlue  text-white border-minionBlue rounded-md p-[1px] hover:tracking-[1px] hover:bg-white hover:text-minionBlue mt-3"
            onClick={() => open()}
          >
            Send
          </button>
        </ul>
      </div>
      <Modal
        width={400}
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        destroyOnClose
      >
        <div className="px-2 mt-5 flex items-center justify-between">
          <div className="">
            Confirm Receiver ID and Coin Quanity again, please
          </div>
          <div className="flex justify-center mt-2">
            <button
              className="border-[1px] px-3 py-1 rounded-md dark:border-slate-600 
                hover:dark:text-green-400 hover:border-green-400 hover:text-green-400"
              onClick={() => Send()}
            >
              Yes
            </button>
            <button
              className="border-[1px] px-3 ml-2 py-1 rounded-md dark:border-slate-600 
                hover:dark:text-green-400 hover:border-green-400 hover:text-green-400"
              onClick={() => setVisible(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DropdownNotification;
