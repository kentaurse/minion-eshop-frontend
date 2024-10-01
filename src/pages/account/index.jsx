import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import MyInfo from "./components/MyInfo";
import CoinCharge from "./components/CoinCharge";
import Favorite from "./components/Favorite";
import FavoriteArticle from "./components/FavoriteArticle";
import ProductHistory from "./components/ProductHistory";
import AddArticleHistory from "./components/AddArticleHistory";
import axios from "axios";

const { RangePicker } = DatePicker;
const rangePresets = [
  {
    label: "Last 7 Days",
    value: [dayjs().add(-7, "d"), dayjs()],
  },
  {
    label: "Last 14 Days",
    value: [dayjs().add(-14, "d"), dayjs()],
  },
  {
    label: "Last 30 Days",
    value: [dayjs().add(-30, "d"), dayjs()],
  },
  {
    label: "Last 90 Days",
    value: [dayjs().add(-90, "d"), dayjs()],
  },
];
const currentDate = new Date();
const dateNumber = dayjs(currentDate).daysInMonth();
const initialDate = [dayjs().date(1), dayjs().date(dateNumber)];

const MyAccount = () => {
  const { showSide } = useSelector((store) => store.side);
  const { user, token } = useSelector((store) => store.user);
  const [allInfo, setAllInfo] = useState();

  const [newMonthDate, setNewMonthDate] = useState(initialDate);

  const accountAllInfo = async () => {
    const res = await axios.post(
      process.env.REACT_APP_API_BASE_URL + "/api/user/userAccount/",
      {
        sDate: newMonthDate[0].format("YYYY-MM-DD"),
        eDate: newMonthDate[1].format("YYYY-MM-DD"),
      }
    );
    setAllInfo(res?.data);
  };
  console.log(allInfo);
  useEffect(() => {
    accountAllInfo();
  }, []);

  const handleDatePickerValueChange = (newValue) => {
    setNewMonthDate([moment(newValue[0])._i, moment(newValue[1])._i]);
  };

  return (
    <>
      <div className="rounded-xl  font-satoshi px-4  sm:px-8 mt-2 mx-0 sm:mx-4 min-h-full">
        <div className="container mx-auto">
          <div
            className={`flex gap-6 justify-between  ${
              showSide ? "w-[96%]" : "w-[100%]"
            }  w-full  `}
          >
            <div className="w-[50%]">
              <MyInfo
                user={user}
                productNum={allInfo?.productHistory?.length}
                articleNum={allInfo?.articleHistory?.length}
              />
            </div>
            <div className="flex flex-col w-[50%]">
              <div className="flex justify-between">
                <div></div>
                <RangePicker
                  className=" rounded-lg bg-base-100 border-pink-500 h-10 mt-4 w-[40%]"
                  defaultValue={newMonthDate}
                  presets={rangePresets}
                  allowClear={false}
                  onChange={handleDatePickerValueChange}
                />
              </div>
              <CoinCharge coin={user?.money} />
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <div
            className={`flex gap-6  ${
              showSide ? "w-[96%]" : "w-[100%]"
            } mt-6  w-full  `}
          >
            <div className=" w-[33%]">
              <Favorite />
            </div>
            <div className=" w-[66%]">
              <ProductHistory
                showData={allInfo?.productHistory}
                userAvatar={user?.avatar}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto">
          <div
            className={`flex gap-6  ${
              showSide ? "w-[96%]" : "w-[100%]"
            }   w-full  `}
          ></div>
        </div>

        <div className="container mx-auto">
          <div
            className={`flex gap-6  ${
              showSide ? "w-[96%]" : "w-[100%]"
            } mt-6  w-full  `}
          >
            <div className=" w-[33%]">
              <FavoriteArticle />
            </div>
            <div className=" w-[66%]">
              <AddArticleHistory
                showData={allInfo?.articleHistory}
                userAvatar={user?.avatar}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyAccount;
