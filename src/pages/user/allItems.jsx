import React, { useCallback } from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { FaSearch, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import BasicModal from "../../components/BasicModal";
import Permission from "../../components/permission";
import {
  getAllUsers,
  allowUser,
  deleteUser,
  changeUserStore,
  changeUserRole,
} from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import defaultAvatar from "../../assets/image/avatar.png";
import Loader from "../../components/Loader";
import { showNotification } from "../../redux/headerSlice";
import axios from "axios";

export default function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef();
  const { user, token } = useSelector((store) => store.user);
  const { newNotificationMessage } = useSelector((store) => store.header);
  const [page, setPage] = useState(0);
  const [perpage, setPerpage] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchParam, setSearchParam] = useState("");
  const [userList, setUserList] = useState([]);
  const [isOpen, SetIsOpen] = useState(false);
  const [deleteItems, SetDeleteItems] = useState([]);
  const [storeList, setStoreList] = useState();
  const [checkBoxArr, SetCheckBoxArr] = useState();
  const [loading, setLoading] = useState(false);

  // const getStroeList = useCallback(async () => {
  //   const { data } = await axios.get(
  //     process.env.REACT_APP_API_BASE_URL + "/api/store/get"
  //   );
  //   setStoreList(data?.stores);
  // }, []);
  useEffect(() => {
    // getStroeList();
    if (!token || user?.role == "user") {
      navigate("/");
    }
  }, []);
  // console.log(userList, "this is jaeho");

  useEffect(() => {
    SetCheckBoxArr(new Array(userList?.length).fill(false));
  }, [userList]);

  const fetchData = useCallback(async () => {
    let getAllUser_obj = {
      perpage: perpage,
      page: page,
    };
    const res = await dispatch(getAllUsers(getAllUser_obj));
    if (searchParam !== "") {
      let data = res?.payload.userList.filter((val) => {
        return (
          val.firstName.toLowerCase().includes(searchParam) ||
          val.lastName.toLowerCase().includes(searchParam) ||
          val.email.toLowerCase().includes(searchParam) ||
          (val.money + "").toLowerCase().search(searchParam.toLowerCase()) ===
            0 ||
          (val.bio + "").toLowerCase().includes(searchParam)
        );
      });
      setUserList(data);
    } else {
      setUserList(res?.payload.userList);
      setTotal(res?.payload.total);
    }
  }, [page, perpage, searchParam]);
  useEffect(() => {
    fetchData();
  }, [page, perpage, newNotificationMessage, searchParam]);

  const choose = (next) => {
    setPage(next);
  };

  const changePerpage = (value) => {
    setPerpage(value);
  };

  const allCheck = (e) => {
    const deleteUserList = userList.filter((item) => {
      return item._id !== user._id;
    });
    SetCheckBoxArr(new Array(userList.length).fill(true));
    SetDeleteItems(
      deleteUserList.map((val, key) => {
        if (val._id !== user._id) {
          return val._id;
        }
      })
    );
  };

  const allUnChedk = () => {
    SetCheckBoxArr(new Array(userList.length).fill(false));
    SetDeleteItems([]);
  };

  const checkHandler = (val, index, id) => {
    SetCheckBoxArr(
      checkBoxArr.map((check, key) => {
        return key === index ? (check = val) : check;
      })
    );
    val === true
      ? SetDeleteItems([...deleteItems, id])
      : deleteItems.splice(deleteItems.indexOf(id), 1);
  };

  const onclose = () => {
    SetIsOpen(false);
  };

  const delItems = async () => {
    setLoading(true);
    const res = await dispatch(deleteUser(deleteItems));
    setLoading(false);
    if (!res?.payload?.error) {
      dispatch(showNotification({ message: res?.payload?.message, status: 1 }));
    } else {
      dispatch(showNotification({ message: res?.payload?.error, status: 0 }));
    }
    SetIsOpen(false);
    allUnChedk();
  };

  const changeUserPermission = async (permission, userID) => {
    // console.log("change user permision", permission, userID);
    const res = await dispatch(
      allowUser({ permission: permission, userID: userID })
    );
    if (!res?.payload?.error) {
      dispatch(showNotification({ message: res?.payload?.message, status: 1 }));
    } else {
      dispatch(showNotification({ message: res?.payload?.error, status: 0 }));
    }
  };

  // const changeStore = async (e, id) => {
  //   const storeID = e.target.value;
  //   const res = await dispatch(changeUserStore({ storeID, id }));
  //   if (!res?.payload?.error) {
  //     dispatch(showNotification({ message: res?.payload?.message, status: 1 }));
  //   } else {
  //     dispatch(showNotification({ message: res?.payload?.message, status: 0 }));
  //   }
  // };

  const changeRole = async (e, id) => {
    const userRole = e.target.value;
    const res = await dispatch(changeUserRole({ userRole, id }));
    if (!res?.payload?.error) {
      dispatch(showNotification({ message: res?.payload?.message, status: 1 }));
    } else {
      dispatch(showNotification({ message: res?.payload?.message, status: 0 }));
    }
  };
  // console.log(user?.store);
  // console.log(userList);
  // console.log("perpage", perpage, page);

  return (
    <>
      <div className="rounded-md shadow-md  px-[2rem] py-[2rem] mx-4 min-h-full bg-[#ffffff] z-[1]">
        <div className="container mx-auto">
          <div className="relative text-lg font-times rounded-[10px]">
            <div className="w-full">
              <div className="w-full flex flex-row justify-between items-center mb-10">
                <div className="text-2xl text-gray-700 flex flex-row items-center">
                  Total :{" "}
                  <span className="text-minionRed text-2xl font-bold pl-2 pr-4">
                    {" "}
                    {total}
                  </span>
                  <button
                    onClick={() => SetIsOpen(true)}
                    className={
                      user?.role == "admin"
                        ? `flex items-center text-lg gap-1 px-4 py-2 hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans  rounded-md mx-2 text-white bg-minionRed duration-300 ease-out`
                        : `hidden`
                    }
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
                <div className="flex flex-row gap-5">
                  <div className="border border-minionBlue rounded-[10px] py-1 px-2 flex items-center">
                    <span className="text-minionBlue pr-3">
                      <FaSearch />
                    </span>
                    <input
                      type="search"
                      ref={searchRef}
                      onChange={(e) => setSearchParam(e.target.value)}
                      name=""
                      id=""
                      className="outline-none w-[250px] text-gray-700"
                      placeholder="Search..."
                    />
                  </div>
                </div>
              </div>
              <table className=" w-full colBorderTable">
                <colgroup>
                  <col width="5%" />
                  <col hidden={user?.role != "admin"} width="5%" />
                  <col width="7.5%" />
                  <col width="10%" />
                  <col width="15%" />
                  <col width="10%" />
                  <col width="17.5%" />
                  <col hidden={user?.role != "admin"} width="12.5%" />
                  <col hidden={user?.role != "admin"} width="12.5%" />
                  <col width="5%" />
                </colgroup>
                <thead className="bg-[#c6edff] ">
                  <tr className="py-4">
                    <th className="py-4 pt-6 pl-2 text-minionBlue text-lg">
                      No
                    </th>
                    <th
                      hidden={user?.role != "admin"}
                      className="py-4 pt-6 text-minionBlue"
                    >
                      <input
                        onChange={(e) => {
                          e.target.checked === true ? allCheck() : allUnChedk();
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="w-[20px] h-[20px]  accent-minionBlue translate-y-1"
                      />
                    </th>
                    <th className="py-4 pt-6 text-minionBlue text-lg">
                      Avatar
                    </th>
                    <th className="py-4 pt-6 text-minionBlue text-lg">Name</th>
                    <th className="py-4 pt-6 text-minionBlue text-lg">Email</th>
                    <th className="py-4 pt-6 text-minionBlue text-lg">
                      Phone Number
                    </th>
                    <th className="py-4 pt-6 text-minionBlue text-lg">Money</th>
                    <th className="py-4 pt-6 text-minionBlue text-lg">Bio</th>
                    {/* <th className="py-4 pt-6 text-minionBlue text-lg">Status</th> */}
                    <th
                      hidden={user?.role != "admin"}
                      className="py-4 pt-6 text-minionBlue text-lg"
                    >
                      Role
                    </th>

                    <th className="py-4 pt-6 pr-8 text-minionBlue text-lg">
                      Permission
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {userList?.map((val, index) => {
                    return (
                      <tr
                        key={index}
                        className=" duration-150 ease-linear border-b-[1px] border-b-[#eaf8ff] even:bg-[#eaf8ff]"
                      >
                        <td className="text-center py-2 ">
                          {page + index + 1}
                        </td>
                        <td
                          hidden={user?.role != "admin"}
                          className="text-center py-2 "
                        >
                          {val?._id !== user?._id && (
                            <input
                              onChange={(e) => {
                                checkHandler(e.target.checked, index, val._id);
                              }}
                              checked={checkBoxArr[index]}
                              type="checkbox"
                              name=""
                              id=""
                              className="w-[20px] h-[20px] accent-minionBlue translate-y-1"
                            />
                          )}
                        </td>
                        <td className="text-center py-2 flex flex-row justify-center">
                          <Link
                            to={
                              val._id !== user?._id
                                ? `../${val._id}`
                                : `/app/account`
                            }
                          >
                            <div className="w-[48px] h-[48px] object-center border border-white rounded-full">
                              <img
                                src={
                                  val?.avatar[0]
                                    ? process.env.REACT_APP_API_BASE_URL +
                                      "/api/file/download/" +
                                      val?.avatar[0]
                                    : defaultAvatar
                                }
                                alt=""
                                className="w-full h-full rounded-full"
                              />
                            </div>
                          </Link>
                        </td>
                        <td className="text-center py-2 ">
                          <Link
                            to={
                              val._id !== user?._id
                                ? `../${val._id}`
                                : `/app/account`
                            }
                          >
                            {val.firstName + " " + val.lastName}
                          </Link>
                        </td>
                        <td className="text-center py-2 ">
                          <Link
                            to={
                              val._id !== user?._id
                                ? `../${val._id}`
                                : `/app/account`
                            }
                          >
                            {val.email}
                          </Link>
                        </td>
                        <td className="text-center py-2 ">
                          <Link
                            to={
                              val._id !== user?._id
                                ? `../${val._id}`
                                : `/app/account`
                            }
                          >
                            {val.phone}
                          </Link>
                        </td>
                        <td className="text-center py-2 ">
                          <Link
                            to={
                              val._id !== user?._id
                                ? val._id !== user?._id
                                  ? `../${val._id}`
                                  : `/account`
                                : `/app/account`
                            }
                            className="inline-block w-[100px] truncate"
                          >
                            ${val.money}
                          </Link>
                        </td>
                        <td className="text-center py-2 ">
                          <Link
                            to={
                              val._id !== user?._id
                                ? val._id !== user?._id
                                  ? `../${val._id}`
                                  : `/account`
                                : `/app/account`
                            }
                            className="inline-block w-[150px] truncate"
                          >
                            {val.bio}
                          </Link>
                        </td>
                        {/* <td
                        className={`${val.isOnline ? `text-minionRed` : `text-[#B7B7B7]`
                          } text-center py-2`}
                      >
                        <Link to={val._id !== user?._id ? `../${val._id}` : `/account`}>
                          {val.isOnline ? "online" : "offline"}
                        </Link>
                      </td> */}
                        <td
                          hidden={user?.role != "admin"}
                          className="text-center py-2 "
                        >
                          {val._id !== user?._id ? (
                            <select
                              name="role"
                              id="role"
                              onChange={(e) => {
                                changeRole(e, val?._id);
                              }}
                              value={val.role}
                              className="rounded-lg placeholder-minionBlue bg-gray-100 px-4 outline-none p-2"
                            >
                              <option value="storeManager">Manager</option>
                              <option value="user">User</option>
                            </select>
                          ) : (
                            val.role
                          )}
                        </td>

                        <td className="text-center py-2 ">
                          {(user?.role == "admin" ||
                            user?.role == "storeManager") &&
                          val._id !== user?._id ? (
                            <Permission
                              checked={val.permission}
                              userID={val._id}
                              changeUserPermission={changeUserPermission}
                              disabled={
                                user?.role == "storeManager"
                                  ? val?.role === "admin" ||
                                    val?.role === "storeManager"
                                    ? true
                                    : false
                                  : val?.role === "admin"
                                  ? true
                                  : false
                              }
                            />
                          ) : (
                            <Permission
                              checked={val.permission}
                              userID={val._id}
                              changeUserPermission={changeUserPermission}
                              disabled={true}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-10 flex flex-row justify-end">
              <Pagination
                total={total}
                page={page}
                perpage={perpage}
                choose={choose}
                setPerpage={changePerpage}
                initialPage={[5, 10, 50]}
              />
            </div>
          </div>
        </div>
      </div>
      <BasicModal isOpen={isOpen} onclose={onclose} delItems={delItems}>
        {deleteItems.length === 0 ? (
          <div className="text-xl">Please check items to delete!!!</div>
        ) : (
          <div className="text-xl">
            Are you really delete {deleteItems.length} items?
          </div>
        )}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-[2]">
              <Loader />
            </div>
          </div>
        )}
      </BasicModal>
    </>
  );
}
