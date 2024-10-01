import { memo, useEffect, useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaShoppingCart,
  FaHeart,
  FaArrowCircleDown,
  FaEye,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import BasicModal from "../../../components/BasicModal";
import defaultPrdThumbnails from "../../../assets/image/feature-img.png";
import axios from "axios";
import { showNotification } from "../../../redux/headerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Category } from "../../../layout/Icons";
import { InboxIcon } from "@heroicons/react/24/outline";
import { Rate } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const ItemsArray = ({ result, itemsRefresh }) => {
  const [favouriteList, setFavouriteList] = useState([]);
  const [productInCart, setProductInCart] = useState([])
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const [isOpen, SetIsOpen] = useState(false);
  const [deleteItems, SetDeleteItems] = useState([]);
  const { token } = useSelector((store) => store.user);
  const threeDay = dayjs().add(-3, "d").$d;

  console.log(user.role)
  const onclose = () => {
    SetIsOpen(false);
  };
  const delItems = async () => {
    try {
      const { data } = await axios.delete(
        process.env.REACT_APP_API_BASE_URL +
          "/api/product/delete/" +
          deleteItems[0]
      );
      itemsRefresh();
      onclose();
      dispatch(showNotification({ message: data.message, status: 1 }));
    } catch {}
  };

  useEffect(() => {
    setFavourite();
    getCart()
  }, []);

  const setFavourite = async (id) => {
    if (token) {
      const { data } = await axios.put(
        process.env.REACT_APP_API_BASE_URL + "/api/auth/favourite",
        {
          id: id,
        }
      );
      if (!data.error) {
        setFavouriteList(data?.favouriteList.favourite);
        dispatch(showNotification({ message: data?.message, status: 1 }));
      } else {
        dispatch(showNotification({ message: data?.error, status: 0 }));
      }
    }
  };

  const getCart = async()=>{
    try {
      const res = await axios.get(process.env.REACT_APP_API_BASE_URL +"/api/product/cart", {

      });
      console.log("---------->>>>>>>>>>>>>>>>>",res.data.products[0].products)
      setProductInCart(res.data.products[0].products)}
      catch (err) {}
  }

  const addCart = async (id) => {
    try {
      const res = await axios.post(process.env.REACT_APP_API_BASE_URL +"/api/product/addAProduct", {
        _id: id,
        quantity: 1,
      });
      console.log("----------<<<<<<<<<<<<<<<<",res.data)
      if (res?.data?.type === "success") {
        setProductInCart(res.data.updatedProduct[0].products)
        dispatch(showNotification({ message: res?.data?.message, status: 1 }));
      } else {
        dispatch(showNotification({ message: res?.data?.message, status: 0 }));
      }
    } catch (err) {}
  };
console.log("productInCart",productInCart)

  return (
    <>
      {result?.length ? (
        <div className="product-wrapper grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-x-[5%] gap-y-8">
          {result?.map((product, index) => {
            return (
              <div
                key={index}
                className="bg-white  rounded-xl px-6 py-6 overflow-hidden shadow-md border-[1px] border-gray-200 relative "
              >
                {dayjs(product.createdAt).$d > threeDay ? (
                  <span className="ribbon">NEW</span>
                ) : (
                  ""
                )}

                <div className="absolute left-3 top-3 z-10 flex justify-center items-center">
                  <img src="/logo.svg" alt="logo" className="w-10 h-auto" />
                </div>
                {user?.role === "admin" ? (
                  <div className="absolute right-6 top-8 z-10 flex justify-center items-center">
                    <Link
                      to={`edit/${product._id}`}
                      title="edit"
                      className="block text-gray-700 w-fit aspect-[1/1] rounded-full shadow-md hover:bg-minionBlue   hover:text-white shadow-gray-400 bg-[#ffffff81] p-4 mr-2 duration-150"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      title="delete"
                      onClick={() => {
                        SetIsOpen(true);
                        SetDeleteItems([product._id]);
                      }}
                      className="inline-block text-gray-700 w-fit aspect-[1/1] rounded-full shadow-md hover:bg-minionRed hover:text-white shadow-gray-400 bg-[#ffffff81] p-4 mr-2 duration-150"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <div className="absolute right-6 top-8 z-10 flex justify-center items-center">
                    <button
                      title="favourite"
                      onClick={() => {
                        setFavourite(product._id);
                      }}
                      className={`${
                        favouriteList.filter((item) => {
                          return item == product._id;
                        }).length
                          ? `inline-block text-white w-fit aspect-[1/1] rounded-full shadow-md   shadow-gray-400 bg-minionRed p-4 mr-2 duration-150`
                          : `inline-block text-gray-700 w-fit aspect-[1/1] rounded-full shadow-md hover:bg-minionRed hover:text-white shadow-gray-400 bg-[#ffffff81] p-4 mr-2 duration-150`
                      }`}
                    >
                      <FaHeart />
                    </button>
                    {/* <button
                      title="cart"
                      onClick={() => addCart(product._id)}
                      className={`${
                        productInCart?.filter((item) => {
                          return item?.product == product._id;
                        }).length
                          ? `inline-block text-white w-fit aspect-[1/1] rounded-full shadow-md   shadow-gray-400 bg-minionRed p-4 mr-2 duration-150`
                          : `inline-block text-gray-700 w-fit aspect-[1/1] rounded-full shadow-md hover:bg-minionRed hover:text-white shadow-gray-400 bg-[#ffffff81] p-4 mr-2 duration-150`
                      }`}
                    >
                      <FaShoppingCart />
                    </button> */}
                  </div>
                )}

                <Link
                  to={"#"
                    // user?.role !== "user" || !user.role
                    //   ? `${product._id}`
                    //   : `/app/product/view/${product._id}`
                  }
                  className="w-full aspect-[16/9] rounded-xl overflow-hidden inline-block"
                >
                  <img
                    src={
                      product.thumbnail.length
                        ? process.env.REACT_APP_API_BASE_URL +
                          "/api/file/download/" +
                          product.thumbnail[0]
                        : defaultPrdThumbnails
                    }
                    alt="productDetail"
                    className="w-full h-full rounded-xl object-cover hover:scale-[1.2] duration-500 hover:rotate-[5deg]"
                  />
                </Link>
                <div className="p-8 flex flex-col items-center">
                  <p className="text-center text-gray-700 text-2xl font-semibold truncate flex-col  items-center gap-6">
                    {product.name}{" "}
                    <span className="mt-4 text-minionBlue bg-minionLightBlue px-4 py-1 rounded-full flex text-lg items-center gap-2">
                      <Category />
                      {product?.category_product?.title}
                    </span>
                  </p>
                  <p className="py-4 text-center text-xl flex items-center text-gray-700 font-normalmy-4">
                    Price: &nbsp; ${product.price + product.price * 0.1}
                    &nbsp;&nbsp;
                    {(product.discount * 100) /
                      (product.price + product.price * 0.1) !=
                    "0" ? (
                      <span className="text-white  text-2xl px-2 rounded-xl flex items-center justify-center gap-1 bg-[#ff8259] animate-bounce ">
                        <span className="text-xl">
                          {" "}
                          <FaArrowCircleDown></FaArrowCircleDown>
                        </span>
                        {((product.discount * 100) / product.price)
                          .toString()
                          .slice(0, 4) + "%"}
                      </span>
                    ) : (
                      <></>
                    )}
                  </p>
                  <div className="flex justify-center items-center gap-2 text-minionBlue text-xl pb-3">
                    <Rate allowHalf count={5} value={product.rate} disabled />

                    {product?.review?.length !== undefined ? (
                      <span>
                        {" "}
                        <CommentOutlined /> {product?.review?.length}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  {user?.role !== "user" || !user.role ? (
                    <Link
                      to={`${product._id}`}
                      className="border-minionBlue border mx-auto  py-1 rounded-md px-4 text-xl text-center bg-minionBlue text-white hover:bg-white hover:text-minionBlue duration-500"
                    >
                      <span className="flex justify-center items-center">
                        {" "}
                        <FaEye />
                        &nbsp;Detail
                      </span>
                    </Link>
                  ) : (
                    <Link
                    to={`${product._id}`}
                    className="border-minionBlue border mx-auto  py-1 rounded-md px-4 text-xl text-center bg-minionBlue text-white hover:bg-white hover:text-minionBlue duration-500"
                  >
                    <span className="flex justify-center items-center">
                      {" "}
                      <FaShoppingCart />
                        &nbsp;Buy
                    </span>
                  </Link>

                    // <Link
                    //   to={`/app/product/view/${product._id}`}
                    //   className="border-minionBlue border mx-auto  py-1 rounded-md px-4 text-xl text-center bg-minionBlue text-white hover:bg-white hover:text-minionBlue duration-500"
                    // >
                    //   <span className="flex justify-center items-center">
                    //     {" "}
                    //     <FaShoppingCart />
                    //     &nbsp;Buy
                    //   </span>
                    // </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center py-20">
          <InboxIcon className="w-20 opacity-[0.7] py-3" />
          <span className=" text-xl opacity-[0.7]">No product found!</span>
        </div>
      )}
      <BasicModal isOpen={isOpen} onclose={onclose} delItems={delItems}>
        <div className="text-xl">Are you really delete item?</div>
      </BasicModal>
    </>
  );
};
export default memo(ItemsArray);
