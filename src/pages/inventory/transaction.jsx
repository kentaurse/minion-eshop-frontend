import React from "react";
import {
  FaBackward,
  FaTrash,
  FaSearch,
  FaUserAlt,
  FaProductHunt,
  FaImage,
  FaImages,
  FaPaypal,
  FaDatabase,
  FaCalendarAlt,
} from "react-icons/fa";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import TransactionItem from "../../components/Transactionitem";
import { showNotification } from "../../redux/headerSlice";
import { InboxIcon } from "@heroicons/react/24/outline";
import { FieldNumberOutlined, ApartmentOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
const currentDate = new Date();
const dateNumber = dayjs(currentDate).daysInMonth();
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

export default function AllItem() {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [delButton, setDelButton] = useState(true);
  const [delCat, setDelCat] = useState(false);
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(5);
  const [result, setResult] = useState([]);
  const [checkedController, setCheckedController] = useState(false);
  const [param] = useSearchParams();
  const searchRef = useRef();
  const lessThanRef = useRef();
  const moreThanRef = useRef();
  const [flag, setFlag] = useState(false);
  const [flag1, setFlag1] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [category, setCategory] = useState();
  const [searchCategory, setSearchCategory] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [lessthan, setLessThan] = useState(10000000);
  const [morethan, setMoreThan] = useState(0);
  const [total, setTotal] = useState(0);
  const [newMonthDate, setNewMonthDate] = useState([
    dayjs().date(1),
    dayjs().date(dateNumber),
  ]);
  let del = [];
  const [id, setId] = useState("");
  console.log(param.get("id"));
  useEffect(() => {
    const getCategoryList = async () => {
      const { data } = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/user/getallcategories"
      );
      setCategory(data?.categories);
    };
    getCategoryList();
  }, []);

  const handleDatePickerValueChange = (newValue) => {
    setNewMonthDate([moment(newValue[0])._i, moment(newValue[1])._i]);
  };

  useEffect(() => {
    getAllTransactions();
  }, [
    page,
    perpage,
    morethan,
    lessthan,
    searchCategory,
    searchWord,
    newMonthDate,
  ]);
  const getAllTransactions = async () => {
    try {
      if (Number(morethan) > Number(lessthan)) {
        dispatch(
          showNotification({
            message: "Input more than and less than correctly!",
            status: 0,
          })
        );
        return;
      }
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL +
          `/api/inventory/inventory/transactions`,
        {
          id: param.get("id"),
          perpage: perpage,
          page: page,
          category: searchCategory,
          searchWord: searchWord,
          moreThan: morethan,
          lessThan: lessthan,
          sDate: newMonthDate[0].format("YYYY-MM-DD"),
          eDate: newMonthDate[1].format("YYYY-MM-DD"),
        }
      );
      console.log(res?.data?.total?.length);
      dispatch(showNotification({ message: res?.data?.message, status: 1 }));
      if (res?.data?.total?.length === 0) {
        dispatch(showNotification({ message: "No Transaction", status: 2 }));
      }

      setTransactions(
        res?.data?.allTransactions?.map((item) => {
          return { ...item };
        })
      );
      setTotal(res?.data?.total[0]?.total || 0);
    } catch {
      dispatch(
        showNotification({
          message: "Server is not running correctly!",
          status: 0,
        })
      );
    }
  };

  const choose = (next) => {
    setPage(next);
  };

  const changePerpage = (value) => {
    setPerpage(value);
  };

  const cancelDel = () => {
    setDelButton(true);
    setDelCat(false);
  };

  const selectDel = () => {
    setDelButton(false);
    setDelCat(true);
  };

  const changeCheckValue = (id) => {
    setTransactions(
      transactions.map((item) => {
        if (item._id === id) {
          return { ...item, checked: !item.checked };
        }
        return item;
      })
    );
    setCheckedController(false);
  };

  const checkCtr = (e) => {
    setCheckedController(!checkedController);

    if (!checkedController) {
      setTransactions(
        transactions.map((item, index) => {
          return { ...item, checked: true };
        })
      );
    } else {
      setTransactions(
        transactions.map((item, index) => {
          return { ...item, checked: false };
        })
      );
    }
  };

  const confirmDel = async () => {
    transactions.map((item) => {
      if (item.checked == true) {
        del.push(item._id);
      }
    });
    const delTransactions = {
      data: del,
    };

    if (delTransactions.data.length === 0) {
      dispatch(showNotification({ message: "Select category!", status: 2 }));
    }

    try {
      const res = await axios.put(
        process.env.REACT_APP_API_BASE_URL +
          "/api/inventory/multideletecategory",
        delTransactions
      );
      dispatch(showNotification({ message: res.data.message, status: 1 }));
    } catch {
      dispatch(
        showNotification({
          message: "Server is not running correctly!",
          status: 0,
        })
      );
    }
  };

  const initSearch = (id) => {
    if (id === "search") {
      searchRef.current.value = "";
      setSearchWord("");
      setFlag(false);
    }
    if (id === "less") {
      lessThanRef.current.value = "";
      setLessThan(1000000000);
      setFlag2(false);
    }
    if (id === "more") {
      moreThanRef.current.value = "";
      setMoreThan(0);
      setFlag1(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-md shadow-md px-[2rem] py-[2rem] mx-4 h-full">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center mt-[40px] justify-between gap-6 md:gap-20 ">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[24px]  font-bold text-minionBlue">
                  Total:
                  <span className="text-3xl pl-4 text-minionRed">{total}</span>
                </p>
              </div>
              <div className="flex justify-between items-center">
                {delButton && (
                  <button
                    onClick={() => selectDel()}
                    className="flex items-center gap-1 px-4 py-2 hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans  rounded-md mx-2 text-white bg-minionRed duration-300 ease-out"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
                {delCat && (
                  <div className="flex items-center">
                    <button
                      onClick={() => confirmDel()}
                      className="flex items-center gap-1 px-4 py-2 hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans  rounded-md mx-2 text-white bg-minionRed duration-300 ease-out"
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() => cancelDel()}
                      className="flex items-center gap-1 px-4 py-2 hover:text-minionBlue hover:bg-white border-[1px] hover:border-minionBlue font-sans  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out"
                    >
                      <FaTrash /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center flex-wrap flex-row gap-5 md:pr-6">
              <div className="w-full border border-minionBlue rounded-[10px] py-1 px-2 flex items-center">
                <span
                  onClick={() => {
                    setSearchWord(searchRef.current.value);
                  }}
                  className="text-minionBlue hover:cursor-pointer pr-3"
                >
                  <FaSearch />
                </span>
                <input
                  type="text"
                  ref={searchRef}
                  name=""
                  id=""
                  onChange={(e) => {
                    e.target.value ? setFlag(true) : setFlag(false);
                  }}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13)
                      setSearchWord(searchRef.current.value);
                  }}
                  className="outline-none bg-transparent  text-minionBlue"
                  placeholder="Search..."
                />
                <span
                  id="search"
                  onClick={(e) => {
                    initSearch(e.target.id);
                  }}
                  className={`text-xl  text-minionBlue ${
                    flag === true
                      ? `visible hover:cursor-pointer`
                      : "invisible "
                  }`}
                >
                  x
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
            <div>
              <RangePicker
                className=" rounded-lg w-full bg-base-100 border-minionBlue h-10"
                presets={rangePresets}
                defaultValue={newMonthDate}
                allowClear={false}
                onChange={handleDatePickerValueChange}
              />
            </div>
            <div>
              {
                <select
                  name="storeSearch"
                  id="storeSearch"
                  onChange={(e) => {
                    setSearchCategory(e.target.value);
                  }}
                  className="rounded-lg w-full placeholder-minionBlue border bg-transparent border-minionBlue outline-none p-2"
                >
                  <option value="">All</option>
                  {category?.map((value, index) => {
                    return (
                      <option key={index} id={value?._id} value={value?._id}>
                        {value?.title}
                      </option>
                    );
                  })}
                </select>
              }
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label htmlFor="" className="text-minionBlue text-xl">
                Price:
              </label>
              <div className="flex flex-col w-full sm:flex-row sm:items-center gap-2">
                <div className="border w-full border-minionBlue rounded-[10px] py-1 px-2 flex items-center">
                  <input
                    type="number"
                    ref={moreThanRef}
                    min={0}
                    name=""
                    id=""
                    onChange={(e) => {
                      e.target.value ? setFlag1(true) : setFlag1(false);
                    }}
                    onKeyUp={(e) => {
                      if (e.keyCode === 13)
                        setMoreThan(moreThanRef.current.value);
                    }}
                    className="outline-none bg-transparent w-[100px] text-minionBlue"
                    placeholder="More than"
                  />
                  <span
                    id="more"
                    onClick={(e) => {
                      initSearch(e.target.id);
                    }}
                    className={`text-xl  text-minionBlue ${
                      flag1 === true
                        ? `visible hover:cursor-pointer`
                        : "invisible "
                    }`}
                  >
                    x
                  </span>
                </div>
                <div className="border w-full border-minionBlue rounded-[10px] py-1 px-2 flex items-center">
                  <input
                    type="number"
                    ref={lessThanRef}
                    min={0}
                    name=""
                    id=""
                    onChange={(e) => {
                      e.target.value ? setFlag2(true) : setFlag2(false);
                    }}
                    onKeyUp={(e) => {
                      if (e.keyCode === 13)
                        setLessThan(lessThanRef.current.value);
                    }}
                    className="outline-none bg-transparent w-[100px] text-minionBlue"
                    placeholder="Less than"
                  />
                  <span
                    id="less"
                    onClick={(e) => {
                      initSearch(e.target.id);
                    }}
                    className={`text-xl  text-minionBlue ${
                      flag2 === true
                        ? `visible hover:cursor-pointer`
                        : "invisible "
                    }`}
                  >
                    x
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className=" p-2 pb-6 bg-base-100  mt-2">
            <div className=" mt-2"></div>

            {/** Card Body */}
            <div className=" w-full  bg-base-100 ">
              <div className=" h-[550px] overflow-y-auto pr-4">
                <table className=" w-full overflow-x-auto">
                  <thead className="bg-[#c6edff]  m-2">
                    <tr className="py-4">
                      <th className="py-4 pt-6 px-4 pl-4 text-minionBlue text-lg">
                        <FieldNumberOutlined style={{ fontSize: "24px" }} />
                      </th>
                      {delCat && (
                        <th className="pt-6 px-2 py-4 pl-[10px] text-minionBlue text-xl">
                          <input
                            type="checkbox"
                            className="pt-6 cursor-pointer duration-1000"
                            name=""
                            id=""
                            checked={checkedController}
                            onChange={() => checkCtr()}
                          />
                        </th>
                      )}
                      <th className="py-4  pt-6 px-4   text-minionBlue text-lg">
                        <span className="flex justify-center items-center gap-2">
                          <FaImages />
                          Thumbnail
                        </span>
                      </th>

                      <th className="py-4 flex justify-center items-center  pt-6 px-4 text-minionBlue text-lg">
                        <span className="flex justify-center items-center gap-2">
                          <FaProductHunt />
                          Name
                        </span>
                      </th>

                      <th className="py-4  pt-6 px-4 text-minionBlue text-lg">
                        <span className="flex justify-center items-center gap-2">
                          <FaImage />
                          Avatar
                        </span>
                      </th>

                      <th className="py-4  pt-6 px-4 text-minionBlue text-lg">
                        <span className="flex justify-center items-center gap-2">
                          <FaUserAlt />
                          User
                        </span>
                      </th>
                      <th className="py-4 pt-6  px-4 text-minionBlue text-lg">
                        <span className="flex justify-center items-center gap-2">
                          <ApartmentOutlined />
                          Category
                        </span>
                      </th>
                      <th className="py-4  pt-6 px-4 text-minionBlue text-lg">
                        <span className="flex justify-center items-center gap-2">
                          <FaPaypal />
                          Pay
                        </span>
                      </th>
                      <th className="py-4 pt-6  px-4 text-minionBlue text-lg ">
                        <span className="flex justify-center items-center gap-2">
                          <FaDatabase />
                          Amount
                        </span>
                      </th>
                      <th className="py-4 px-4 text-minionBlue text-lg">
                        <span className="flex justify-center items-center gap-2">
                          <FaCalendarAlt />
                          Date
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {transactions.map((data, index) => {
                      return (
                        <TransactionItem
                          key={index}
                          index={index}
                          page={page}
                          data={data}
                          changeCheckValue={changeCheckValue}
                          delCat={delCat}
                        />
                      );
                    })}
                  </tbody>
                </table>
                {transactions.length ? (
                  ""
                ) : (
                  <div className="w-full flex flex-col justify-center items-center py-20">
                    <InboxIcon className="w-20 opacity-[0.7] py-3" />
                    <span className=" text-xl opacity-[0.7]">
                      No transaction found!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-[5px]">
            <Pagination
              total={total}
              page={page}
              perpage={perpage}
              choose={choose}
              setPerpage={changePerpage}
              initialPage={[5, 10, 50]}
            />
          </div>
          <div className="flex justify-end">
            <Link
              to="../"
              className="flex items-center justify-center text-xl gap-3 px-4 py-2 hover:text-gray-700 hover:bg-white border-[1px] hover:border-gray-100 font-satoshi  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out  mt-[20px] w-[200px]"
            >
              <FaBackward /> Go Inventory
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
