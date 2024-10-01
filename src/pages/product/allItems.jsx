import React, { Suspense, lazy } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import { Slider } from "antd";
import { showNotification } from "../../redux/headerSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import axios from "axios";
const ItemsArray = lazy(() => import("./component/itemsArray"));
import dayjs from "dayjs";

export default function AllItems() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { showSide } = useSelector((store) => store.side);
  const searchRef = useRef();
  const lessThanRef = useRef();
  const moreThanRef = useRef();
  const [datas, setDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(6);
  const [totalPrice, setTotalPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState();
  const [searchCategory, setSearchCategory] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [flag, setFlag] = useState(false);
  const [flag1, setFlag1] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [lessthan, setLessThan] = useState(10000000);
  const [morethan, setMoreThan] = useState(0);
  const [sort, setSort] = useState("");
  const [rate, setRate] = useState({ rate: [0, 5] });
  const [newGood, setNewGood] = useState({
    sDate: new Date(0),
    today: new Date(),
  });
  const [favourite, setFavourite] = useState("");

  const choose = (next) => {
    setPage(next);
  };

  useEffect(() => {
    const getCategoryList = async () => {
      const { data } = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/user/getallcategories"
      );
      setCategory(data?.categories);
    };
    getCategoryList();
  }, []);

  const changePerpage = (value) => {
    setPerpage(value);
  };

  useEffect(() => {
    let totalPrice = 0;
    datas?.map((val) => {
      totalPrice += Number(val.price + val.price * 0.1);
    });
    setTotalPrice(totalPrice);
  }, [datas]);

  useEffect(() => {
    getAllPrds();
  }, [
    page,
    perpage,
    morethan,
    lessthan,
    searchCategory,
    newGood,
    favourite,
    searchWord,
    sort,
    rate,
  ]);

  const getAllPrds = async () => {
    try {
      if (morethan > lessthan) {
        dispatch(
          showNotification({
            message: "Input more than and less than correctly!",
            status: 0,
          })
        );
        return;
      }
      const { data } = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/product/get",
        {
          perpage: perpage,
          page: page,
          category: searchCategory,
          searchWord: searchWord,
          moreThan: morethan - morethan * 0.1,
          lessThan: lessthan - lessthan * 0.1,
          newGood: newGood,
          favourite: favourite,
          sort: sort,
          rate: rate,
        }
      );
      setTotal(data?.total[0]?.total);
      setDatas(data?.products);
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
      setLessThan(100000000);
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
      <div className="rounded-xl  font-satoshi px-4  sm:px-8 py-28 mx-0 sm:mx-4 min-h-full">
        <div className="container mx-auto ">
          <div
            className={`flex fixed z-[50] top-24 backdrop-blur-xl bg-white/2 mb-8 shadow-md rounded-xl py-4 px-8 flex-wrap gap-y-4 justify-between items-center ${
              showSide ? "w-[78%]" : "w-[92%]"
            } `}
          >
            <p className="text-[20px]">
              Total: &nbsp;
              {total}
              <span className=" text-minionRed font-black text-[1.5em]">
                &nbsp;&nbsp; ( ${totalPrice} )
              </span>
            </p>
            <div className="flex gap-2">
              <div className="border border-minionBlue rounded-[10px] py-1 px-2 flex items-center">
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
                  className="outline-none bg-transparent w-[250px] text-minionBlue"
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
              {user?.role === "admin" ? (
                <Link
                  to="addition"
                  className="  gap-1 px-4 py-2 pl-2 border-minionBlue hover:text-minionBlue hover:bg-white border-[1px] hover:border-minionBlue font-sans rounded-md text-white bg-minionBlue duration-300 ease-out"
                >
                  <span className="flex items-center pl-2 gap-2 animate-pulse">
                    <FaPlus />
                    Add New
                  </span>
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-y-4 items-center justify-start gap-x-8">
              <div className="sm:flex-wrap lg:flex items-center flex-row gap-3 my-5 ">
                <label htmlFor="" className="text-minionBlue text-xl">
                  Price:
                </label>
                <div className="flex gap-3">
                  <div className="border border-minionBlue rounded-[10px] py-1 px-2 flex items-center">
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
                  <div className="border border-minionBlue rounded-[10px] py-1 px-2 flex items-center">
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
                <div className="flex items-center gap-3">
                  <div>
                    <select
                      name="storeSearch"
                      id="storeSearch"
                      onChange={(e) => {
                        setSearchCategory(e.target.value);
                      }}
                      className="rounded-lg placeholder-minionBlue border bg-transparent border-minionBlue outline-none p-2"
                    >
                      <option value="">All</option>
                      {category?.map((value, index) => {
                        return (
                          <option
                            key={index}
                            id={value?._id}
                            value={value?._id}
                          >
                            {value?.title}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <select
                      name="select"
                      id="select"
                      onChange={(e) => {
                        {
                          e.target.value === "new"
                            ? setNewGood({
                                sDate: dayjs().add(-3, "d").$d,
                                today: dayjs().$d,
                              })
                            : e.target.value === "favourite"
                            ? setFavourite({
                                userId: user?._id,
                              })
                            : (setNewGood({
                                sDate: new Date(0),
                                today: new Date(),
                              }),
                              setFavourite(""));
                        }
                      }}
                      className="rounded-lg placeholder-minionBlue border bg-transparent border-minionBlue outline-none p-2"
                    >
                      <option value="">Select</option>
                      <option value="new">New</option>
                      <option value="favourite">Favourite</option>
                    </select>
                  </div>

                  <div>
                    <select
                      name="select"
                      id="select"
                      onChange={(e) => {
                        {
                          e.target.value === "name"
                            ? setSort("name")
                            : e.target.value === "date"
                            ? setSort("date")
                            : e.target.value === "price"
                            ? setSort("price")
                            : e.target.value === "quantity"
                            ? setSort("quantity")
                            : e.target.value === "remain"
                            ? setSort("remain")
                            : e.target.value === "discount"
                            ? setSort("discount")
                            : "";
                        }
                      }}
                      className="rounded-lg placeholder-minionBlue border bg-transparent border-minionBlue outline-none p-2"
                    >
                      <option value="">Filter</option>
                      <option value="name">Name</option>
                      <option value="date">Date</option>
                      <option value="price">Price</option>
                      <option value="quantity">Quantity</option>
                      <option value="remain">Remain</option>
                      <option value="discount">Discount</option>
                    </select>
                  </div>
                </div>
                
              </div>
            </div>
            <p className=" flex items-center">
                  <span className="inline-block mr-3 text-xl text-minionBlue">
                    Rate:
                  </span>
                  <Slider
                    defaultValue={[0, 5]}
                    range
                    min={0}
                    max={5}
                    step={0.5}
                    onChange={(value) => {
                      setRate({ rate: value });
                    }}
                    className="w-[38%]"
                  />
                </p>
          </div>

          <Suspense
            fallback={
              <div className="flexjustify-center items-center gap-x-4 text-[20px]  h-[50vh]">
                <Loader />
              </div>
            }
          >
            <ItemsArray result={datas} itemsRefresh={getAllPrds} />
          </Suspense>

          <div className="flex items-center justify-end gap-x-8 mt-8">
            <div></div>
            <Pagination
              total={total}
              page={page}
              perpage={perpage}
              choose={choose}
              setPerpage={changePerpage}
              initialPage={[6, 10, 50]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
