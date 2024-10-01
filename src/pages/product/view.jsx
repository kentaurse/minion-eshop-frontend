import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { showNotification } from "../../redux/headerSlice";
import { useDispatch, useSelector } from "react-redux";
import feature from "../../assets/image/feature-img.png";
import DefaultAvatar from "../../assets/image/avatar.png";
import { FaRegSave, FaShoppingCart } from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";
import { Rate } from "antd";
import * as Icons from "../../layout/Icons";

export default function View() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const param = useParams();
  const [prdId, setPrdId] = useState(param.id);
  const [productQuantity, setProductQuantity] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [prdData, setPrdData] = useState({
    id: "",
    name: "",
    description: "",
    totalPrice: 0,
    totalDiscount: 0,
    realPrice: 0,
  });
  const [review, setReview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featureImg, setFeatureImg] = useState(feature);
  const [content, setContent] = useState("");
  const [rate, setRate] = useState(4);

  console.log("------------->>>>", rate);

  useEffect(() => {
    setBuyPrice(
      Number(prdData?.price * productQuantity) -
        Number(prdData?.discount * productQuantity)
    );
  }, [productQuantity]);

  const sendComment = async () => {
    const res = await axios.put(
      process.env.REACT_APP_API_BASE_URL + "/api/product/addreview/" + prdId,
      {
        comment: content,
        rate: rate,
      }
    );
  };

  useEffect(() => {
    getAllcategories();
    getPrdData();
  }, []);

  const getAllcategories = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/user/getallcategories"
      );
      if (res.data.categories.length === 0) {
        dispatch(
          showNotification({ message: "No category found!", status: 0 })
        );
      }
      setCategories(res.data.categories);
    } catch {
      dispatch(
        showNotification({
          message: "Server is not running correctly!",
          status: 0,
        })
      );
    }
  };
  const updatePrdData = (value, id) => {
    setPrdData({ ...prdData, [id]: value });
  };

  const getPrdData = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/product/get/" + prdId
      );
      console.log("<<<<<<>>>>>>>>===========", data);
      setPrdData({
        id: data.product?._id,
        name: data.product?.name,
        description: data.product.description,
        price: data.product.price + data.product.price * 0.1,
        quantity: data.product.quantity,
        discount: data.product.discount,
        remain: data.product.remain,
        thumbnail: data.product.thumbnail,
      });
      setReview(data?.product.review);
      setFeatureImg(
        data.product.thumbnail[0]
          ? process.env.REACT_APP_API_BASE_URL +
              "/api/file/download/" +
              data.product.thumbnail[0]
          : feature
      );
    } catch (err) {
      return dispatch(showNotification({ message: err, status: 0 }));
    }
  };
  console.log(review);
  useEffect(() => {
    let sum = (prdData?.price - prdData?.discount) * prdData?.quantity;
    updatePrdData(sum, "totalPrice");
    updatePrdData(prdData?.discount * prdData?.quantity, "totalDiscount");
    updatePrdData(prdData?.price * prdData?.quantity, "realPrice");
  }, [prdData?.price, prdData?.discount, prdData?.quantity]);

  const handleForm = async (e) => {
    e.preventDefault();
    if (!productQuantity) {
      dispatch(showNotification({ message: "Input quantity!", status: 0 }));
    } else if (productQuantity > prdData.remain) {
      dispatch(
        showNotification({ message: "Input quantity correctly!", status: 0 })
      );
    } else if (prdData?.price * productQuantity > user?.money) {
      dispatch(showNotification({ message: "Not enough money!", status: 0 }));
    } else {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL +
          "/api/inventory/inventory/transaction/addition",
        {
          productId: prdData?.id,
          price: prdData?.price,
          quantity: productQuantity,
        }
      );
      window.socket.emit("C2S_NEW_NOTIFICATION", {
        user: `${user?.lastName} ${user?.firstName}`,
        email: user?.email,
        product: prdData?.name,
        quantity: productQuantity,
        price: prdData?.price * productQuantity,
      });
    }
  };

  return (
    <div className=" bg-white sm:px-10 md:px-12  pt-24 text-xl rounded-md font-satoshi shadow-md  py-[2rem] mx-4 min-h-full">
      <div className="flex flex-col items-center xl:flex-row gap-24">
        <div className="rounded-xl h-full min-h-96 w-[80%] overflow-hidden xl:w-4/12 border-2 border-minionBlue">
          <img
            src={featureImg ? featureImg : feature}
            alt="feature image"
            className="w-full h-full min-h-96 rounded-lg hover:scale-125 duration-500"
          />
        </div>
        <div className="w-full xl:w-8/12">
          <div className="flex justify-between items-center">
            <h2 className="flex items-center gap-2 text-4xl text-minionBlue font-bold px-8 py-2 rounded-full w-fit">
              <Icons.Category /> {prdData?.name}
            </h2>

            <h3 className="text-xl text-gray-500 font-normal mt-8">
              Remain:&nbsp;{" "}
              <span className="text-minionBlue font-semibold text-2xl bg-minionLightBlue px-6 py-2 rounded-full">
                {prdData?.remain}
              </span>
            </h3>
          </div>
          <div className="mt-8">
            {" "}
            <h3 className="text-2xl text-minionBlue font-semibold">
              Description:&nbsp;
            </h3>{" "}
            <p className="mt-8 text-lg h-32 overflow-y-auto">
              {prdData?.description} This is test description This is test
              descriptionThis is test descriptionThis is test description This
              is test description v This is test description This is test
              description v vThis is test descriptionThis is test
              descriptionThis is test descriptionThis is test description This
              is test description This is test description This is test
              descriptionThis is test descriptionThis is test descriptionThis is
              test descriptionThis is test descriptionThis is test
              descriptionThis is test descriptionThis is test descriptionThis is
              test descriptionThis is test descriptionThis is test
              descriptionThis is test descriptionThis is test descriptionThis is
              test description
            </p>
          </div>
          <div className="flex justify-center xl:justify-start gap-12 mt-8">
            <div>
              <h3 className=" text-xl text-gray-400  mt-8">
                Price:&nbsp;{" "}
                <span className="text-2xl text-minionBlue font-semibold">
                  {prdData?.price}$
                </span>
              </h3>
              <h3 className="text-xl text-gray-400 mt-8">
                Discount:&nbsp;{" "}
                <span className="text-2xl text-minionBlue font-semibold">
                  {" "}
                  {prdData?.discount}$
                </span>
              </h3>

              <div className="xl:order-3 order-4 xl:w-1/5 w-full h-fit flex items-center gap-3 mt-8">
                <span className="inline-block text-gray-400 text-xl">
                  Quantity:
                </span>
                {user.role === "admin" ? (
                  <input
                    type="number"
                    id="quantity"
                    placeholder=""
                    min={0}
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    className="cursor-not-allowed w-24 border-[1px] font-satoshi text-xl focus:outline-none  text-minionBlackBlue border-minionBlue px-4 py-1 rounded-md"
                    value={prdData?.quantity || 0}
                  />
                ) : (
                  <input
                    type="number"
                    id="quantity"
                    placeholder=""
                    min={0}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    className=" border-[1px] w-24 font-satoshi text-xl focus:outline-none  text-minionBlackBlue border-minionBlue px-4 py-1 rounded-md"
                    value={productQuantity}
                  />
                )}
              </div>
              <button className="flex items-center gap-2 mt-6 border-minionBlue border   py-1 rounded-md px-4 text-xl text-center bg-minionBlue text-white hover:bg-white hover:text-minionBlue duration-500">
                <FaShoppingCart></FaShoppingCart>Add to Cart
              </button>
            </div>

            <div className="xl:order-2 mt-4 order-3 flex h-fit  w-1/2 xl:w-[20%] justify-center flex-col gap-y-6">
              <p className="text-[26px] mt-4 text-minionBlue font-[900]">
                {user.role === "admin"
                  ? prdData?.price * prdData?.quantity
                  : prdData?.price * productQuantity}
              </p>
              <p className="text-[26px] mt-4 font-[900] text-gray-500">
                <del>
                  {user.role === "admin"
                    ? prdData?.discount * prdData?.quantity
                    : prdData?.discount * productQuantity}
                </del>
              </p>
              <p className="text-[26px] mt-4 text-minionRed font-[900]">
                $
                {user.role === "admin"
                  ? Number(prdData?.price * prdData?.quantity) -
                    Number(prdData?.discount * prdData?.quantity)
                  : Number(prdData?.price * productQuantity) -
                    Number(prdData?.discount * productQuantity)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 w-full">
        <h3 className="text-4xl text-center text-minionBlue font-bold">
          Add Comment
        </h3>
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="flex gap-4 items-center">
            <h3 className="text-2xl text-minionBlack">Rate</h3>
            <Rate
              allowHalf
              count={5}
              value={rate}
              onChange={(e) => setRate(e)}
            />
          </div>

          <div className="w-full xl:w-[60%] mt-6">
            <label
              htmlFor="content"
              className="block text-2xl font-semibold text-minionBlack"
            >
              {" "}
              Content
            </label>
            <textarea
              onChange={(e) => {
                setContent(e.target.value);
              }}
              className="w-full h-80 overflow-y-auto border-[2px] border-minionLightBlue font-satoshi text-xl focus:outline-none  text-minionBlackBlue duration-100 outline-none focus:border-minionBlue px-4 py-1 rounded-md"
            />
          </div>
          <button
            onClick={() => {
              sendComment();
            }}
            className="flex items-center gap-2 mt-6 border-minionBlue border mx-auto  py-1 rounded-md px-4 text-xl text-center bg-minionBlue text-white hover:bg-white hover:text-minionBlue duration-500"
          >
            <FaRegSave></FaRegSave> Submit
          </button>
        </div>
      </div>
      <div className="mt-12 w-full">
        <h3 className="text-4xl text-center text-minionBlue font-bold">
          Reviews
        </h3>
        <div className="w-full flex flex-col items-center">
          {review?.map((item, index) => {
            console.log(item);
            return (
              <div
                key={index}
                className=" bg-minionLightBlue justify-between border-[1px] border-white hover:bg-white hover:border-minionBlue rounded-xl w-full my-4 py-4 px-8 flex flex-col items-center md:flex-row md:items-start gap-8 duration-100 ease-in"
              >
                <div className="my-4 flex flex-col items-center md:flex-row md:items-start gap-8">
                  <img
                    src={
                      item?.user?.avatar?.length
                        ? process.env.REACT_APP_API_BASE_URL +
                          "/api/file/download/" +
                          item?.user?.avatar[0]
                        : DefaultAvatar
                    }
                    alt="avatar"
                    className="w-24 h-24 xl:w-28 xl:h-28 rounded-2xl"
                  />

                  <div>
                    <h3 className="pt-0 md:pt-4 text-center md:text-start text-2xl font-semibold text-minionBlue">
                      {item?.user?.lastName} {item.user?.firstName}
                    </h3>
                    <p className="pt-2 text-xl font-normal text-minionBlackBlue break-words">
                      {item.comment}
                    </p>
                  </div>
                </div>
                <div className="pt-8">
                  <Rate allowHalf count={5} value={item.rate} disabled />
                  <p className="pt-8">
                    {(
                      item.date.toString().split("T")[0] +
                      " " +
                      item.date.toString().split("T")[1]
                    ).slice(0, 19)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
