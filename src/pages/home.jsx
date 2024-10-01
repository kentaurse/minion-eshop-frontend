import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  FaTrash,
  FaEdit,
  FaShoppingCart,
  FaHeart,
  FaArrowCircleDown,
  FaEye,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Category } from "../layout/Icons";
import ItemsArray from "./product/component/itemsArray";
import defaultPrdThumbnails from "../assets/image/feature-img.png";
import DashboardUserTable from "./dashboard/component/DashboardUserTable";
import AllCardCategory from "./dashboard/component/AllCardCategory";
import dayjs from "dayjs";
import Footer from "../components/Footer";
import MainView from "../components/MainView";

export default function Home() {
  const { showSide } = useSelector((store) => store.side);
  const { user } = useSelector((store) => store.user);
  const [img, setImg] = useState(3);
  const [newProducts, setNewProducts] = useState();
  const currentDate = new Date();
  const [allInfo, setAllInfo] = useState({});
  const dateNumber = dayjs(currentDate).daysInMonth();
  const initialDate = [dayjs().date(1), dayjs().date(dateNumber)];
  const [newMonthDate, setNewMonthDate] = useState(initialDate);
  const [popularProducts, setPopularProducts] = useState();

  const getNewProducts = async () => {
    const res = await axios.get(
      process.env.REACT_APP_API_BASE_URL + "/api/homeproduct/newProducts"
    );
    const newProducts = res?.data?.newproduct;
    setNewProducts(newProducts);
  };
  useEffect(() => {
    getNewProducts();
  }, []);

  const getPopularProducts = async () => {
    const res = await axios.get(
      process.env.REACT_APP_API_BASE_URL + "/api/homeproduct/popularProducts"
    );
    const popularProducts = res?.data?.popularProducts;
    setPopularProducts(popularProducts);
  };
  useEffect(() => {
    getPopularProducts();
  }, []);

  const plusSlides = (a) => {
    if (img + a < 1) {
      setImg(11);
    } else if (img + a > 11) {
      setImg(1);
    } else {
      setImg(img + a);
    }
  };

  const getAllInfo = async (newMonthDate) => {
    const res = await axios.post(
      process.env.REACT_APP_API_BASE_URL + "/api/dashboard/adminGetAllInfo",
      {
        sDate: newMonthDate[0].format("YYYY-MM-DD"),
        eDate: newMonthDate[1].format("YYYY-MM-DD"),
      }
    );
    setAllInfo(res.data);
  };
  useEffect(() => {
    getAllInfo(newMonthDate);
  }, [user, newMonthDate]);

  return (
    <div className=" flex flex-col  ">
      <MainView className="" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 ">
        <div className="col-span-2 ">
          <p className="text-minionBlue font-sans text-4xl pl-10 pb-3 font-bold ">
            New Products
          </p>
          <div className="w-full h-fit  pb-5  px-8 grid grid-cols-3 gap-3">
            {/* <ItemsArray result={newProducts} /> */}
            {newProducts?.map((product, index) => {
              return (
                <div
                  key={index}
                  className="bg-white  rounded-xl px-4 py-2  overflow-hidden shadow-md border-[1px] col-span -1 flex flex-col justify-center items-center relative"
                >
                  <Link
                    to={
                      user?.role !== "user" || !user.role
                        ? `${product._id}`
                        : `/app/product/view/${product._id}`
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
                        to={`/app/product/view/${product._id}`}
                        className="border-minionBlue border mx-auto  py-1 rounded-md px-4 text-xl text-center bg-minionBlue text-white hover:bg-white hover:text-minionBlue duration-500"
                      >
                        <span className="flex justify-center items-center">
                          {" "}
                          <FaShoppingCart />
                          &nbsp;Buy
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-1">
          <p className="text-minionBlue font-sans text-4xl pl-10 pb-3 font-bold ">
            Popular Products
          </p>
          <div className=" bg-white  shadow-md  flex flex-col items-between overflow-y-auto  h-[450px]  py-5  px-8 rounded-xl gap-2">
            {popularProducts?.map((product, index) => {
              return (
                <div
                  key={index}
                  className="bg-white  border-dotted border-gray-300 border-b-2  flex flex-row justify-start"
                >
                  <div className="w-[25%] h-full overflow-hidden px-6 py-3">
                    <Link
                      to={`/app/product/view/${product._id}`}
                      className="h-full rounded-sm overflow-hidden  w-full"
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
                        className="w-full h-full rounded-md"
                      />
                    </Link>
                  </div>
                  <p className="py-1 text-gray-700 text-2xl font-semibold truncate flex flex-col  items-start gap-2">
                    {product.name}{" "}
                    <span className=" text-minionBlue bg-minionLightBlue px-4 py-1 rounded-full flex text-lg gap-2">
                      <Category />
                    </span>
                    <span className="text-lg text-gray-600 font-normal">
                      {product?.description.slice(0, 20) + "..."}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-6">
        <div className="grid grid-cols-1 xxl:flex xl:flex mt-4 items-center gap-4 ">
          <div className="bg-white flex w-full gap-6 shadow-md mt-8 xl:flex h-[450px]  py-5 xl:w-1/2 px-8 rounded-xl">
            <DashboardUserTable
              title={"The Best Users"}
              showData={allInfo?.bestUser}
            />
          </div>
          <div className="bg-white flex w-full gap-6 shadow-md mt-8 xl:flex h-[450px]  py-5 xl:w-1/2 px-8 rounded-xl">
            <AllCardCategory
              title={"The Popular Article"}
              showData={allInfo?.popularArticle}
            />
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
