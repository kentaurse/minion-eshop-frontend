import React from "react";
import {
  FaPlus,
  FaFilter,
  FaTrash,
  FaBackward,
  FaChessKing,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import { InboxIcon } from "@heroicons/react/24/outline";
import { STORE_ALL_ITEMS } from "../../components/Const";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/image/avatar.png";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/headerSlice";

export default function AllItems() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(3);
  const [result, setResult] = useState([]);
  const [datas, setDatas] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [checkedController, setCheckedController] = useState(false);
  const [delButton, setDelButton] = useState(true);
  const [delStore, setDelStore] = useState(false);
  const [noStore, setNoStore] = useState("");
  let del = [];

  useEffect(() => {
    getAllStores();
  }, []);

  const getAllStores = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/store/get`
    );
    if (res.data.stores.length === 0) {
      setNoStore("No store found!");
    }
    setStores(
      res.data.stores.map((item, key) => {
        return { ...item, checked: false };
      })
    );
    console.log(res.data, "asdf");
  };

  useEffect(() => {
    setResult(datas.slice(page, page + perpage));
  }, [datas, page, perpage]);

  const choose = (next) => {
    setPage(next);
  };

  const changePerpage = (value) => {
    setPerpage(value);
  };

  useEffect(() => {
    if (searchParam !== "") {
      setDatas(
        stores.filter((card) => {
          return (
            card.name.toLowerCase().search(searchParam.toLowerCase()) !== -1 ||
            card.users.toLowerCase().search(searchParam.toLowerCase()) !== -1
          );
        })
      );
      setPage(0);
    } else {
      setDatas(stores);
    }
  }, [searchParam, stores]);

  const changeCheckValue = (id) => {
    setStores(
      stores.map((item) => {
        if (item._id === id) {
          return { ...item, checked: !item.checked };
        }
        return item;
      })
    );
    setCheckedController(false);
  };

  const checkCtr = () => {
    setCheckedController(!checkedController);

    if (!checkedController) {
      setStores(
        stores.map((item, index) => {
          return { ...item, checked: true };
        })
      );
    } else {
      setStores(
        stores.map((item, index) => {
          return { ...item, checked: false };
        })
      );
    }
  };

  const selectDel = () => {
    setDelButton(false);
    setDelStore(true);
  };

  const cancelDel = () => {
    setDelButton(true);
    setDelStore(false);
  };

  const confirmDel = async () => {
    stores.map((item) => {
      if (item.checked == true) {
        del.push(item._id);
      }
    });
    const delstores = {
      data: del,
    };

    if (delstores.data.length === 0) {
      dispatch(showNotification({ message: "Select category!", status: 2 }));
    }

    try {
      const res = await axios.put(
        process.env.REACT_APP_API_BASE_URL + "/api/store/delete",
        delstores
      );
      dispatch(showNotification({ message: res.data.message, status: 1 }));

      setTimeout(() => {
        setPage(0);
        setStores(res.data.stores);
        if (res.data.stores.length === 0) {
          setNoStore("No store found!");
        }
      }, 1000);
    } catch {
      dispatch(
        showNotification({
          message: "Server is not running correctly!",
          status: 0,
        })
      );
    }
  };

  const handleEditForm = (e, data) => {
    e.preventDefault();
    navigate("edit/" + data._id);
  };

  return (
    <div className="bg-white rounded-md shadow-md px-[2rem] py-[2rem] mx-4 h-full">
      <div className="container mx-auto">
        <div className="flex justify-center mb-[40px]">
          <div>
            <div className=" lg;w-[800px] xl:w-[986px] flex items-center mt-[40px] justify-between gap-20 ">
              <div className="flex items-center gap-4 ">
                <div>
                  <p className="text-[24px] text-minionBlue  font-bold">
                    Total: {stores.length}
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
                  {delStore && (
                    <div className="flex items-center">
                      <button
                        onClick={() => confirmDel()}
                        className="flex items-center gap-1 px-4 py-2 hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans  rounded-md mx-2 text-white bg-minionRed duration-300 ease-out"
                      >
                        <FaTrash /> Delete
                      </button>
                      <button
                        onClick={() => cancelDel()}
                        className="flex items-center gap-1 px-4 py-2 hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans  rounded-md mx-2 text-white bg-minionRed duration-300 ease-out"
                      >
                        <FaBackward /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="items-end flex justify-end">
                  <input
                    type="search"
                    placeholder="...filter"
                    value={searchParam}
                    className=" font-sans w-6/12 text-minionBlue rounded-tl-lg rounded-bl-lg border-[1px] text-lg border-stroke bg-transparent py-1 px-4 text-md outline-none transition border-minionBlue active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onChange={(e) => setSearchParam(e.target.value)}
                  />
                  <span className=" rounded-tr-lg rounded-br-lg bg-minionBlue px-2 py-2 text-white text-xl border-[1.5px] border-stroke border-minionBlue">
                    <FaFilter />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    to="addition"
                    className="flex items-center gap-1 px-4 py-2 hover:text-minionBlue hover:bg-white border-[1px] hover:border-minionBlue font-sans  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out"
                  >
                    <FaPlus /> Add New
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg;w-[800px] xl:w-[990px] p-2 pb-6 bg-base-100  mt-6">
              {/** Card Body */}
              <div className=" w-full mt-[24px] bg-base-100 ">
                <div className=" h-[440px] overflow-y-auto pr-4">
                  <table className=" w-full relative">
                    <thead className=" top-[29%] w-[955px]  bg-[#c6edff]">
                      <tr className="">
                        <th className="pt-6 rounded-tl-xl py-4  pl-4 text-minionBlue  text-xl">
                          No
                        </th>
                        {delStore && (
                          <th>
                            <input
                              type="checkbox"
                              className="cursor-pointer duration-1000 w-[15px] h-[15px]"
                              name=""
                              id=""
                              checked={checkedController}
                              onChange={() => checkCtr()}
                            />
                          </th>
                        )}
                        <th className="py-4 px-4 pt-6  text-minionBlue text-lg">
                          Manager
                        </th>
                        <th className="py-4 pt-6  text-minionBlue text-xl">
                          Name
                        </th>
                        <th className="py-4 pt-6  text-minionBlue text-xl">
                          Users
                        </th>
                        <th className="py-4 pt-6  text-minionBlue text-xl rounded-tr-xl">
                          Earned
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {result.map((data, index) => {
                        return (
                          <tr
                            key={index}
                            className="hover:bg-[#d7f2ff] duration-150 ease-linear border-b-[1px] border-b-[#eaf8ff] even:bg-[#eaf8ff] cursor-pointer"
                            onClick={(e) => {
                              handleEditForm(e, data);
                            }}
                          >
                            <td
                              className="text-center py-2 "
                              onClick={(e) => {
                                handleEditForm(e, data);
                              }}
                            >
                              {index + 1 + page}
                            </td>
                            {delStore && (
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  className="cursor-pointer w-[15px] h-[15px] duration-1000"
                                  name=""
                                  id=""
                                  checked={data.checked}
                                  onChange={() => changeCheckValue(data._id)}
                                />
                              </td>
                            )}
                            <td className="text-center py-2 flex items-center justify-center">
                              <div>
                                <div className="flex justify-start items-center gap-3">
                                  <div className="w-[48px] h-[48px] object-center">
                                    <img
                                      src={
                                        data.manager?.avatar[0]
                                          ? process.env.REACT_APP_API_BASE_URL +
                                            "/api/file/download/" +
                                            data.manager?.avatar[0]
                                          : defaultAvatar
                                      }
                                      className="w-full h-full rounded-full"
                                    />
                                  </div>
                                  <div>
                                    {data.manager?.firstName +
                                      " " +
                                      data.manager?.lastName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td
                              className="text-center py-2 "
                              onClick={(e) => {
                                handleEditForm(e, data);
                              }}
                            >
                              {data.name}
                            </td>
                            <td
                              className="text-center py-2 "
                              onClick={(e) => {
                                handleEditForm(e, data);
                              }}
                            >
                              {data.users}
                            </td>
                            <td
                              className="text-center py-2 "
                              onClick={(e) => {
                                handleEditForm(e, data);
                              }}
                            >
                              {data.earned}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {result.length ? (
                    ""
                  ) : (
                    <div className="w-full flex flex-col justify-center items-center py-20">
                      <InboxIcon className="w-20 opacity-[0.7] py-3" />
                      <span className=" text-xl opacity-[0.7]">{noStore}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center pb-[30px] pt-[5px]">
              <Pagination
                total={stores.length}
                page={page}
                perpage={perpage}
                choose={choose}
                setPerpage={changePerpage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
