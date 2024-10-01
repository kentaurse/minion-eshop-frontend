import React from "react";
import { FaSave, FaBackward } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/headerSlice";

export default function Addition() {
  const dispatch = useDispatch();

  const [storeName, setStoreName] = useState("");
  const [storeManager, setStoreManager] = useState("");
  const [userDis, setUserDis] = useState([]);
  const [productList, setProductList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [storeProduct, setStoreProduct] = useState([]);
  let product = [];
  let productItems = [];

  useEffect(() => {
    getAllProducts();
    getAllUsers();
  }, []);

  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/product/get`
      );
      setProductList(
        res.data.products.map((item) => {
          return { ...item, selected: false };
        })
      );
    } catch {
      dispatch(
        showNotification({
          message: "Server is not running corrctly!",
          status: 0,
        })
      );
    }
  };

  const getAllUsers = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/getAllUser`
    );
    setUserList(
      res.data.userList.map((user) => {
        return { ...user, fullName: user.lastName + " " + user.firstName };
      })
    );
  };

  useEffect(() => {
    if (storeManager !== "") {
      setUserDis(
        userList.filter((item) => {
          return (
            item.fullName
              .trim()
              .toLowerCase()
              .search(storeManager.trim().toLowerCase()) !== -1
          );
        })
      );
    } else {
      setUserDis([]);
    }
  }, [storeManager]);

  const handleManager = (e, item) => {
    e.preventDefault();
    setStoreManager(item.fullName);
  };

  const handleProductList = (e, item) => {
    e.preventDefault();

    setProductList(
      productList.map((productItem) => {
        if (productItem._id === item._id) {
          return { ...productItem, selected: !productItem.selected };
        }
        return productItem;
      })
    );
  };

  useEffect(() => {
    productList.map((item) => {
      if (item.selected === true) {
        product.push(item);
      }
    });
    setStoreProduct(product);
  }, [productList]);

  const handleStoreProduct = (e, item) => {
    e.preventDefault();
    setProductList(
      productList.map((productItem) => {
        if (productItem._id === item._id) {
          return { ...productItem, selected: false };
        }
        return productItem;
      })
    );
  };

  const handleForm = async (e) => {
    e.preventDefault();

    if (storeName.length === 0) {
      dispatch(showNotification({ message: "Input store name!", status: 2 }));
    } else if (storeProduct.length === 0) {
      dispatch(showNotification({ message: "Select products!", status: 2 }));
    } else if (storeManager.length === 0) {
      dispatch(showNotification({ message: "Choose manager!", status: 2 }));
    } else if (userDis.length === 0) {
      dispatch(
        showNotification({ message: "Choose manager correctly!", status: 2 })
      );
    } else {
      storeProduct.map((item, key) => {
        productItems.push(item._id);
      });

      try {
        const res = await axios.post(
          process.env.REACT_APP_API_BASE_URL + "/api/store/create",
          { name: storeName, product: productItems, manager: userDis[0]._id }
        );
        if (res.data.error) {
          dispatch(showNotification({ message: res.data.message, status: 0 }));
        } else {
          dispatch(showNotification({ message: res.data.message, status: 1 }));

          setStoreName("");
          setStoreProduct([]);
          setStoreManager("");
          setProductList(
            productList.map((productItem) => {
              return { ...productItem, selected: false };
            })
          );
        }
      } catch {
        dispatch(
          showNotification({
            message: "Server is not running correctly!",
            status: 0,
          })
        );
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-md shadow-md px-[2rem] py-[2rem] mx-4 h-full">
        <div className="container mx-auto flex items-center justify-center lg:w-[600px] md:w-[450px] sm:w-[300px] h-[83vh]">
          <form
            onSubmit={(e) => {
              handleForm(e);
            }}
            className="flex flex-col gap-10"
          >
            <div>
              <label className="block text-xl text-gray-700">
                Name <span className="text-minionRed pl-[5px]">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter the title..."
                value={storeName}
                className="border border-gray-100 focus:outline-none text-lg font-normal bg-gray-100   pl-[20px] rounded-[5px] focus:border-minionBlue mt-[20px] w-full py-2"
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <div className="block text-xl text-gray-700">
                Product<span className="text-minionRed pl-[5px]">*</span>
              </div>
              <div className="border  border-gray-100 px-4 py-2 rounded-[5px] bg-gray-100   mt-[20px] min-h-[72px] max-h-[96px] overflow-auto">
                <div className="flex flex-wrap gap-2">
                  {storeProduct.map((item, key) => {
                    return (
                      <button
                        key={key}
                        className="z-20 px-2 py-1 text-xl flex items-center gap-1 cursor-pointer text-minionBlue bg-white border-[1px] border-minionBlue font-sans rounded-md hover:text-white hover:bg-minionBlue duration-300 ease-out"
                        onClick={(e) => {
                          handleStoreProduct(e, item);
                        }}
                      >
                        {item.name}
                        <span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-wrap w-full gap-2 mt-3 min-h-[72px] max-h-[96px] overflow-auto">
                {productList.map((item, key) => {
                  return (
                    <button
                      key={key}
                      className={`z-20 px-8 font-sans py-2 flex text-lg items-center cursor-pointer ${
                        item.selected
                          ? "text-white bg-minionBlue"
                          : "text-minionBlue bg-white"
                      } border-[1px] border-minionBlue font-sans rounded-md hover:text-white hover:bg-minionBlue duration-300 ease-out`}
                      onClick={(e) => {
                        handleProductList(e, item);
                      }}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-xl text-gary-700 pt-5">
                Manager <span className="text-minionRed pl-[5px]">*</span>
              </label>
              <input
                type="text"
                placeholder="Select the manager..."
                value={storeManager}
                className="border border-gray-100 focus:outline-none text-lg font-sans bg-gray-100 font-normal focus:border-minionBlue pl-[20px] rounded-[5px] mt-[20px] w-full py-2"
                onChange={(e) => setStoreManager(e.target.value)}
              />
              <div className="flex gap-2 mt-3 px-3 h-[40px] overflow-auto">
                {userDis.map((item, key) => {
                  return (
                    <button
                      className="cursor-pointer px-2 py-1 text-minionBlue bg-white border-[1px] border-minionBlue font-sans rounded-md hover:text-white hover:bg-minionBlue duration-300 ease-out"
                      key={key}
                      onClick={(e) => handleManager(e, item)}
                    >
                      {item.fullName}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-10">
              <Link
                to={"../"}
                replace={true}
                type="submit"
                className="px-4 py-2 pl-2 hover:text-minionRed hover:bg-white border-[1px] border-minionRed font-sans rounded-md text-white bg-minionRed duration-300 ease-out"
              >
                <span className="flex text-xl items-center pl-2 gap-2">
                  <FaBackward />
                  Back
                </span>{" "}
              </Link>
              <button
                type="submit"
                className="px-4 py-2 pl-2 hover:text-minionBlue hover:bg-white border-[1px] border-minionBlue font-sans rounded-md text-white bg-minionBlue duration-300 ease-out"
              >
                <span className="flex text-xl items-center pl-2 gap-2">
                  <FaSave />
                  Save
                </span>{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
