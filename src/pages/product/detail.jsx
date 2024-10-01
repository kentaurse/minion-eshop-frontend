import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  showNotification,
  removeNotificationMessage,
} from "../../redux/headerSlice";
import { useDispatch, useSelector } from "react-redux";
import feature from "../../assets/image/feature-img.png";
import { FaBackward, FaEdit, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

export default function Detail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const param = useParams();
  const [prdId, setPrdId] = useState(param.id);
  const [noCategory, setNoCategory] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [prdData, setPrdData] = useState({
    id: "",
    name: "",
    category: undefined,
    description: "",
    totalPrice: 0,
    totalDiscount: 0,
    realPrice: 0,
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState([]);
  const [featureImg, setFeatureImg] = useState(feature);
  // setImageFile
  const [imageFile, setImageFile] = useState("");

  useEffect(() => {
    setBuyPrice(
      Number(prdData?.price * productQuantity) -
        Number(prdData?.discount * productQuantity)
    );
  }, [productQuantity]);

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
      setPrdData({
        id: data.product._id,
        name: data.product.name,
        category: data.product.category._id,
        description: data.product.description,
        price: data.product.price + data.product.price * 0.1,
        quantity: data.product.quantity,
        discount: data.product.discount,
        remain: data.product.remain,
        thumbnail: data.product.thumbnail,
      });
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
    }else if(productQuantity>prdData.remain){
      dispatch(showNotification({ message: "Input quantity correctly!", status: 0 }));
    }else if((prdData?.price*productQuantity)>user?.money){
      dispatch(showNotification({ message: "Not enough money!", status: 0 }));
    }
     else {
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
        price: (prdData?.price*productQuantity),
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-md font-satoshi shadow-md px-[2rem] py-[2rem] mx-4 min-h-full flex items-center">
        <div className="container mx-auto">
          {user?.role === "user" ? (
            <div className=" mb-12 flex justify-end">
              <span className="text-2xl text-minionRed">
                Repoditory:&nbsp;{" "}
                <span className="text-minionBlue">${user.money}</span>
              </span>
            </div>
          ) : (
            ""
          )}
          <form onSubmit={(e) => handleForm(e)}>
            <div className="flex flex-wrap lg:justify-between justify-center items-center gap-y-16">
              <div className="w-full order-2 xl:order-1 xl:w-[25%] flex-shrink-0 flex-grow-0 h-fit">
                <label className="text-xl text-gray-700 inline-block w-full mb-8">
                  <span className="mb-4 inline-block">Name</span>
                  <br />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter the title..."
                    defaultValue={prdData?.name}
                    className="cursor-not-allowed border-[1px] font-satoshi text-xl focus:outline-none w-full text-gray-700 border-gray-100 px-4 py-1 rounded-md"
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    disabled
                  />
                </label>
                <br />
                <label className="text-xl text-gray-700 inline-block w-full mb-8">
                  <span className="mb-4 inline-block">Category</span>
                  <br />
                  <select
                    className="cursor-not-allowed border-[1px] font-satoshi text-xl focus:outline-none w-full text-gray-700 border-gray-100 px-4 py-1 rounded-md bg-gray-100"
                    id="category"
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    disabled
                  >
                    <option value="">
                      {noCategory ? noCategory : "choose Category"}
                    </option>
                    {categories.map((item, key) => {
                      return (
                        <option
                          key={key}
                          value={item._id}
                          selected={item._id === prdData?.category}
                        >
                          {item.title}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <br />
                <label className="text-xl text-gray-700 inline-block w-full">
                  <span className="mb-4 inline-block">Description</span>
                  <br />

                  <textarea
                    type="text"
                    id="description"
                    placeholder="Enter description..."
                    defaultValue={prdData?.description}
                    className="cursor-not-allowed border-[1px] font-satoshi text-xl focus:outline-none w-full text-gray-700 h-40 border-gray-100 py-2 rounded-md px-4"
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    disabled
                  />
                </label>
              </div>
              <div className="xl:order-2 order-3 flex h-fit flex-shrink-0 flex-grow-0 w-1/2 xl:w-[20%] justify-center items-center flex-col gap-y-6 px-8">
                <label className="text-2xl font-bold text-gray-700 inline-block w-full  mb-8">
                  Costs
                </label>
                <p className="text-[26px] text-gray-700 font-[900]">
                  {user.role === "admin"
                    ? prdData?.price * prdData?.quantity
                    : prdData?.price * productQuantity}
                </p>
                <p className="text-[26px] font-[900]">
                  <del>
                    {user.role === "admin"
                      ? prdData?.discount * prdData?.quantity
                      : prdData?.discount * productQuantity}
                  </del>
                </p>
                <p className="text-[26px] text-minionRed font-[900]">
                  $
                  {user.role === "admin"
                    ? Number(prdData?.price * prdData?.quantity) -
                      Number(prdData?.discount * prdData?.quantity)
                    : Number(prdData?.price * productQuantity) -
                      Number(prdData?.discount * productQuantity)}
                </p>
              </div>
              <div className="xl:order-3 order-4 xl:w-1/5 w-full h-fit flex-shrink-0 flex-grow-0">
                <label className="text-xl text-gray-700 inline-block w-full  mb-8">
                  <span className="mb-4 inline-block">Remain</span>
                  <br />
                  <input
                    type="number"
                    id="price"
                    placeholder=""
                    value={prdData?.remain || 0}
                    min={0}
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    className="cursor-not-allowed border-[1px] font-satoshi text-xl focus:outline-none w-full text-gray-700 border-gray-100 px-4 py-1 rounded-md"
                    disabled
                  />
                </label>
                <br />
                <label className="text-xl text-gray-700 inline-block w-full  mb-8">
                  <span className="mb-4 inline-block">Price (USDT)</span>
                  <br />
                  <input
                    type="number"
                    id="remain"
                    placeholder=""
                    value={prdData?.price || 0}
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    className="cursor-not-allowed border-[1px] font-satoshi text-xl focus:outline-none w-full text-gray-700 border-gray-100 px-4 py-1 rounded-md"
                    disabled
                  />
                </label>
                <br />
                <label className="text-xl text-gray-700 inline-block w-full  mb-8">
                  <span className="mb-4 inline-block">Quantity</span>
                  <br />
                  {user.role === "admin" ? (
                    <input
                      type="number"
                      id="quantity"
                      placeholder=""
                      min={0}
                      onChange={(e) =>
                        updatePrdData(e.target.value, e.target.id)
                      }
                      className="cursor-not-allowed border-[1px] font-satoshi text-xl focus:outline-none w-full text-gray-700 border-gray-100 px-4 py-1 rounded-md"
                      value={prdData?.quantity || 0}
                      disabled
                    />
                  ) : (
                    <input
                      type="number"
                      id="quantity"
                      placeholder=""
                      min={0}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      className=" border-[1px] font-satoshi text-xl focus:outline-none w-full text-gray-700 border-gray-100 px-4 py-1 rounded-md"
                      value={productQuantity}
                    />
                  )}
                </label>
                <br />
                <label className="text-xl text-gray-700 inline-block w-full">
                  <span className="mb-4 inline-block">Discount (USD)</span>
                  <br />
                  <input
                    type="number"
                    id="discount"
                    placeholder=""
                    value={prdData?.discount}
                    min={0}
                    max={prdData?.price}
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    className="cursor-not-allowed border-[1px] font-satoshi text-xl focus:outline-none w-full text-gray-700 border-gray-100 px-4 py-1 rounded-md"
                    disabled
                  />
                </label>
              </div>
              <label className="cursor-not-allowed relative lg:order-4 order-1 hover:opacity-70 duration-700 text-gray-700 border-2 border-dotted border-gray-300 shadow-lg h-fit rounded-xl p-2 inline-block xl:w-[18%] w-[300px] xl:ml-[1%] ml-0 aspect-[1/1] flex-shrink-0 flex-grow-0">
                <img
                  src={featureImg}
                  alt="feature"
                  className="w-full aspect-[1/1] rounded-xl border-gray-100"
                />
                <input
                  type="file"
                  id="thumbnail"
                  onChange={(e) => {
                    setFeatureImg(URL.createObjectURL(e.target.files[0]));
                    setImageFile(e.target.files[0]);
                  }}
                  className="hidden"
                  disabled
                />
              </label>
            </div>
            <div className="ml-auto mr-0 flex justify-end mt-[120px]">
              <Link
                to="../"
                className="flex items-center text-xl gap-3 px-4 py-2 hover:text-gray-700 hover:bg-white border-[1px] hover:border-gray-100 font-satoshi  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out  mt-[20px] w-[200px] justify-center"
              >
                <FaBackward /> Go Product
              </Link>

              {user?.role === "user" || !user.role ? (
                <button className="flex items-center text-xl gap-3 px-4 py-2 hover:text-gray-700 hover:bg-white border-[1px] hover:border-gray-100 font-satoshi  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out  mt-[20px] w-[200px] justify-center">
                  <FaShoppingCart />
                  Buy
                </button>
              ) : (
                <Link
                  to={"../edit/" + prdId}
                  className="flex items-center text-xl gap-3 px-4 py-2 hover:text-gray-700 hover:bg-white border-[1px] hover:border-gray-100 font-satoshi  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out  mt-[20px] w-[200px] justify-center"
                >
                  <FaEdit /> Edit
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
