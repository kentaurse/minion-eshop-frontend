import React from "react";
import { FaSave, FaBackward, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/headerSlice";

export default function Addition() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [storeName, setStoreName] = useState("");
  const [storeManager, setStoreManager] = useState("");
  const [userDis, setUserDis] = useState([]);
  const [productList, setProductList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [storeProduct, setStoreProduct] = useState([]);
  const [productItems, setProductItems] = useState([]);
  let product = [];

  const storeId = params?.id;

  useEffect(() => {
    getstore();
  }, [params, navigate]);

  const getstore = async () => {
    if (!storeId) {
      navigate("/");
    } else {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_BASE_URL + "/api/store/get/" + storeId
        );

        setStoreName(res.data.store.name);
        console.log(res.data.store.product);

        setStoreManager(
          res.data.store.manager.lastName +
            " " +
            res.data.store.manager.firstName
        );
        setUserList(
          res.data.userList.map((user) => {
            return { ...user, fullName: user.lastName + " " + user.firstName };
          })
        );
        setProductList(
          res.data.products.map((item) => {
            return { ...item, selected: false };
          })
        );
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

  const handleSaveForm = async (e) => {
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
      try {
        const res = await axios.put(
          process.env.REACT_APP_API_BASE_URL + "/api/store/update/" + storeId,
          {
            name: storeName,
            product: storeProduct,
            manager: userDis[0]._id,
          }
        );
        if (res.data.error) {
          dispatch(showNotification({ message: res.data.message, status: 0 }));
        } else {
          dispatch(showNotification({ message: res.data.message, status: 1 }));

          setTimeout(() => {
            navigate("/app/store");
          }, 1000);
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

  const handleDeleteForm = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        process.env.REACT_APP_API_BASE_URL + "/api/store/delete/" + storeId
      );
      dispatch(showNotification({ message: res.data.message, status: 1 }));

      setTimeout(() => {
        navigate("/app/store");
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

  return (
    <>
      <div className="bg-white rounded-md shadow-md px-[2rem] py-[2rem] mx-4 h-full">
        <div className="container mx-auto flex items-center justify-center lg:w-[600px] md:w-[450px] sm:w-[300px] h-[83vh]">
          <form
            onSubmit={(e) => {
              handleSaveForm(e);
            }}
            className="flex flex-col gap-10"
          >
            <div>
              <label className="block text-xl text-minionBlue">
                Name <span className="text-minionRed pl-[5px]">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter the title..."
                value={storeName}
                className="border focus:outline-none text-xl font-normal  focus:border-minionBlue pl-[20px] rounded-[5px] border-minionBlue mt-[20px] w-full h-[48px]"
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <div className="block text-xl text-minionBlue">
                Product<span className="text-minionRed pl-[5px]">*</span>
              </div>
              <div className="border px-4 py-2 rounded-[5px] border-minionBlue mt-[20px] min-h-[53px] max-h-[70px] overflow-auto">
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
              <div className="flex flex-wrap w-full gap-2 mt-3 min-h-[53px] max-h-[70px] overflow-auto">
                {productList.map((item, key) => {
                  return (
                    <button
                      key={key}
                      className={`z-20 px-2 py-1 flex text-xl items-center cursor-pointer ${
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
              <label className="block text-xl text-minionBlue pt-5">
                Manager <span className="text-minionRed pl-[5px]">*</span>
              </label>
              <input
                type="text"
                placeholder="Select the manager..."
                value={storeManager}
                className="border focus:outline-none text-xl font-normal focus:border-minionBlue pl-[20px] rounded-[5px] border-minionBlue mt-[20px] w-full h-[48px]"
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
            <div className="flex gap-3 justify-between mt-10">
              <div>
                <Link
                  to={"/store"}
                  replace={true}
                  type="submit"
                  className="px-4 py-2 pl-2 hover:text-minionBlue hover:bg-white border-[1px] border-minionBlue font-sans rounded-md text-white bg-minionBlue duration-300 ease-out"
                >
                  <span className="flex text-xl items-center pl-2 gap-2">
                    <FaBackward />
                    Back
                  </span>{" "}
                </Link>
              </div>
              <div className="flex">
                <button
                  type="reset"
                  className="flex items-center gap-1 px-4 py-2 hover:text-minionBlue hover:bg-white border-[1px] hover:border-minionBlue font-sans  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out"
                  onClick={(e) => {
                    handleDeleteForm(e);
                  }}
                >
                  <FaTrash /> Delete
                </button>
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
