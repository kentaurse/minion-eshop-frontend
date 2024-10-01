import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import LineChart from "./component/LineChart";
import CircleChart from "./component/CircleChart";
import ChartTable from "./component/ChartTable";
import AllCardCategory from './component/AllCardCategory';
import {
  FaCalendar,
  FaCoins,
  FaStore
} from "react-icons/fa";
import {
  DatePicker,
} from "antd";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import moment from 'moment'
import DashboardUserTable from "./component/DashboardUserTable";
import { showNotification } from "../../redux/headerSlice";
import Cart from "./component/Cart";

const currentDate = new Date();
const dateNumber = dayjs(currentDate).daysInMonth();
const initialDate = [dayjs().date(1), dayjs().date(dateNumber)]
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

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const [newMonthDate,  setNewMonthDate] = useState(initialDate)
  const [swicthFlag, setSwitchFlag] = useState(true);
  const [allInfo, setAllInfo] = useState({});
  const [chartData, setChartData] = useState([]);
  
  const getAllInfo = async (newMonthDate) => {
    const res = await axios.post(
      process.env.REACT_APP_API_BASE_URL + "/api/dashboard/adminGetAllInfo",
      {sDate: newMonthDate[0].format('YYYY-MM-DD'), 
      eDate: newMonthDate[1].format('YYYY-MM-DD')}
    );
    setAllInfo(res.data);
  };

  useEffect(() => {
    getAllInfo(newMonthDate);
  }, [user,newMonthDate]);

  useEffect(() =>{
    dateChart();
  },[allInfo])

  const handleDatePickerValueChange = (newValue) => {
    setNewMonthDate([(moment(newValue[0]))._i, 
    (moment(newValue[1]))._i])
    dispatch(
      showNotification({
        message: `Period from ${((moment(newValue[0]))._i).format("YYYY-MM-DD")} to ${((moment(newValue[1]))._i).format("YYYY-MM-DD")} `,
        status: 1,
      })
    )
  }
  const dateChart = () =>{
    let allData = [];
    for(let i = 0;  i <= newMonthDate[1]?.diff(newMonthDate[0], "day"); i++){
      allInfo?.chartDate?.date.map((item, key) =>{
        if(item?.date === newMonthDate[0].add(i, "d").format("YYYY-MM-DD")){
          i++;
          return allData.push({date: item?.date, price: item?.price})
        }
      })
      allData.push({date: newMonthDate[0].add(i, "d").format("YYYY-MM-DD"), price: 0})
    }
    setChartData(allData);
  }
  return (
    <>
      <div className="h-[calc(100vh-5rem-32px)] rounded-md px-2 sm:px-4 md:px-12 overflow-y-auto">
        <div className=" mx-auto">
          <RangePicker
              className=" rounded-lg bg-base-100 border-pink-500 h-10 mt-4"
              presets={rangePresets}
              defaultValue={newMonthDate}
              allowClear={false}
              onChange={handleDatePickerValueChange} 
              />

          <div className="grid grid-cols-1 lg:grid-cols-2 xxl:grid-cols-4 mt-8 items-center gap-4 ">
            <Cart title={'Product Status'} total={allInfo?.product?.totalProduct} current={allInfo?.product?.currentProduct} state={1} />
            <Cart title={'Product Transaction'} total={allInfo?.ProductTran?.totalTran} current={allInfo?.ProductTran?.currentTran} state={2} />
            <Cart title={'Product Profit'} total={allInfo?.profit?.totalProfit} current={allInfo?.profit?.currentProfit} state={4} />
            <Cart title={'All Users'} total={allInfo?.user?.totalUser} current={allInfo?.user?.currentUser} state={3} />
          </div>

          <div className="mt-10 flex flex-col items-center  xl:flex-row justify-center gap-6">
            <div className="bg-white shadow-md  w-full h-fit xl:h-[737px] xl:w-7/12  pt-12  pb-12 px-12 rounded-[12px]">
              <h3 className="flex items-center gap-2 justify-center text-2xl text-gray-500 font-bold pb-6">
              {swicthFlag == true ? <FaCalendar></FaCalendar>: <FaStore />}
                Product Sales of {swicthFlag == true ? "Dates": "Products"}
              </h3>
              <div className="flex flex-col gap-12 justify-between">
                <div className="mb-8 flex flex-col gap-3 md:flex-row justify-between items-center">
                  <div></div>
                  <div className="flex items-center gap-3">
                    <label
                      className={`${swicthFlag === true ? "bg-minionBlue text-white" : " bg-gray-200  text-gray-600"} text-xl px-4 py-1 rounded-md`}
                      htmlFor="chart"
                    >
                      Chart
                    </label>
                    <input
                      type="checkbox"
                      className='relative h-8 w-14 appearance-none rounded-[12px] bg-minionBlue outline-none transition duration-[0.5s] 
                        before:absolute before:top-[50%] before:h-7 before:w-8 before:translate-x-[2px] before:translate-y-[-50%] before:rounded-[10px]
                        before:bg-white before:shadow-[0_2px_5px_rgba(0,_0,_0,_.2)] before:transition before:content-[""]
                        checked:before:translate-x-[22px] hover:cursor-pointer checked:bg-minionBlueundefined'
                      name="weekly"
                      id="switch1"
                      onChange={() => setSwitchFlag(!swicthFlag)}
                    ></input>
                    <label
                      className={`${swicthFlag === false ? "bg-minionBlue text-white" : " bg-gray-200  text-gray-600"} text-xl px-4 py-1 rounded-md`}
                      htmlFor="table"
                    >
                      Table
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  {swicthFlag === true ? (
                    <LineChart showData={chartData} />
                  ) : (
                    <div className=" -mt-12 overflow-y-hidden w-full">
                      <ChartTable showData={allInfo?.chartDate?.product} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md  w-full py-8 h-fit xl:h-[737px]  px-[20px] xl:w-5/12 rounded-[12px]">
              <div className="flex items-center gap-2 justify-center text-2xl text-gray-500 font-bold pb-6">
                <FaCoins></FaCoins>Product Profit of Store
              </div>
              <div className="w-full">
                <CircleChart showData={allInfo?.categoryDate} />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xxl:flex xl:flex mt-4 items-center gap-4 ">
            <div className="bg-white flex w-full gap-6 shadow-md mt-8 xl:flex h-[450px]  py-5 xl:w-1/2 px-8 rounded-xl">
              <DashboardUserTable title={'The Best Users'} showData={allInfo?.bestUser} />
            </div>
            <div className="bg-white flex w-full gap-6 shadow-md mt-8 xl:flex h-[450px]  py-5 xl:w-1/2 px-8 rounded-xl">
              <AllCardCategory title={'The Popular Article'} showData={allInfo?.popularArticle} />
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
