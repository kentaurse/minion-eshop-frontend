import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { showNotification } from "../../redux/headerSlice";
import { useDispatch } from "react-redux";
import feature from "../../assets/image/feature-img.png";
import { FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Addition() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [noCategory, setNoCategory] = useState("");
  const [prdData, setPrdData] = useState({
    name: "",
    category: undefined,
    description: "",
    price: 0,
    quantity: 0,
    discount: 0,
    totalPrice: 0,
    totalDiscount: 0,
    realPrice: 0,
  })
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState([]);
  const [featureImg, setFeatureImg] = useState(feature);
  // setImageFile
  const [imageFile, setImageFile] = useState();

  useEffect(() => {
    getAllcategories();
  }, []);

  const getAllcategories = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/user/getallcategories"
      );
      if (res.data.categories.length === 0) {

        dispatch(showNotification({ message: "No category found!", status: 0 }))
      }
      setCategories(res.data.categories);
    } catch {
      dispatch(showNotification({ message: "Server is not running correctly!", status: 0 }))
    }
  };
  const updatePrdData = (value, id) => {
    setPrdData({ ...prdData, [id]: value })
  }

  useEffect(() => {
    let sum = (prdData?.price - prdData?.discount) * prdData?.quantity;
    updatePrdData(sum, "totalPrice")
    updatePrdData(prdData?.discount * prdData?.quantity, "totalDiscount");
    updatePrdData(prdData?.price * prdData?.quantity, "realPrice");

  }, [prdData?.price, prdData?.discount, prdData?.quantity]);

  const handleForm = async (e) => {

    e.preventDefault();

    if (prdData?.name?.trim() === "") {

      dispatch(showNotification({ message: "Name field is required!", status: 0 }));

    } else if (!prdData?.category || prdData?.category?.trim() === "") {

      dispatch(showNotification({ message: "Category field is required!", status: 0 }));

    } else if (prdData?.description.length === 0) {

      dispatch(showNotification({ message: "Description field is required!", status: 0 }));
    } else if (prdData?.price.length === 0) {
      dispatch(showNotification({ message: "Price field is required!", status: 0 }));
    } else if (prdData?.quantity.length === 0) {

      dispatch(showNotification({ message: "Quantity field is required!", status: 0 }));
    } else if (prdData?.discount.length === 0) {
      dispatch(showNotification({ message: "Discount field is required!", status: 0 }));
    } else {
      setIsLoading(true);
      let fileIdList = [];
      if (imageFile) {
        const data = await updateAvartar();
        fileIdList = data?.uploaded?.map((item) => {
          return item?._id;
        });
      }
      console.log(prdData);
      try {

        const res = await axios.post(
          process.env.REACT_APP_API_BASE_URL + "/api/product/create",
          {
            name: prdData?.name,
            category: prdData?.category,
            description: prdData?.description,
            price: prdData?.price,
            quantity: prdData?.quantity,
            sold: "0",
            remain: prdData?.quantity,
            discount: prdData?.discount,
            thumbnail: fileIdList,
          }
        );
        fileIdList = [];
        setIsLoading(false);
        if (res.data.error) {
          return dispatch(showNotification({ message: res.data.message, status: 2 }));
        } else {
          navigate("../")
          return dispatch(showNotification({ message: res.data.message, status: 1 }));
        }
      } catch {
        setIsLoading(false);
        return dispatch(showNotification({ message: "Server is not running correctly!", status: 0 }));
      }
    }
  };
  const updateAvartar = async () => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const { data } = await axios.post(
      process.env.REACT_APP_API_BASE_URL + "/api/file/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  };
  return (
    <>
      <div className="bg-white rounded-md shadow-md px-[2rem] py-[2rem] mx-4 min-h-full flex items-center">
        <div className="container mx-auto">
          <form onSubmit={(e) => handleForm(e)}>

          <div className="flex flex-wrap lg:justify-between justify-center items-center gap-y-16">
              <div className="w-full order-2 xl:order-1 xl:w-[25%] flex-shrink-0 flex-grow-0 h-fit">
                <label className="text-gray-700 text-xl inline-block w-full mb-8">
                  <span className="mb-4 inline-block">Name</span><br />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter the title..."
                    defaultValue={prdData?.name}
                    className="border-[1px] bg-gray-100 border-gray-100 font-sans text-xl focus:outline-none w-full text-gray-700 focus:border-minionBlue px-4 py-1 rounded-md"
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                  />
                </label><br />
                <label className="text-gray-700 text-xl inline-block w-full mb-8">
                  <span className="mb-4 inline-block"> Category</span><br />
                  <select
                    className="border-[1px] font-sans text-xl border-gray-100 bg-gray-100 focus:outline-none w-full text-gray-700 focus:border-minionBlue px-4 py-1 rounded-md"
                    id="category"
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                  >
                    <option value="">
                      {noCategory ? noCategory : "Choose category"}
                    </option>
                    {categories.map((item, key) => {
                      return (
                        <option key={key} value={item._id} selected={item._id === prdData?.category}>
                          {item.title}
                        </option>
                      );
                    })}
                  </select>
                </label><br />
                <label className="text-gray-700 text-xl inline-block w-full">
                  <span className="mb-4 inline-block">Description</span><br />

                  <textarea
                    type="text"
                    id="description"
                    placeholder="Enter description..."
                    defaultValue={prdData?.description}
                    className="border-[1px]  bg-gray-100 border-gray-100 font-sans text-xl focus:outline-none w-full text-gray-700 h-40 focus:border-minionBlue py-2 rounded-md px-4"
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                  />
                </label>
              </div>
              <div className="xl:order-2 order-3 flex h-fit flex-shrink-0 flex-grow-0 w-1/2 xl:w-[20%] justify-center items-center flex-col gap-y-6 px-8">
                <label className="text-gray-700 text-xl  inline-block w-full  mb-8">Costs</label>
                <p className="text-[26px] text-gray-700 font-[900]">${prdData?.price * prdData?.quantity}</p>
                <p className="text-[26px] font-[900]">
                  <del>{prdData?.discount * prdData?.quantity}</del>
                </p>
                <p className="text-[26px] text-minionRed font-[900]">
                  ${Number(prdData?.price * prdData?.quantity) - Number(prdData?.discount * prdData?.quantity)}
                </p>

              </div>
              <div className="xl:order-3 order-4 xl:w-1/5 w-full h-fit flex-shrink-0 flex-grow-0">
                <label className="text-gray-700 text-xl  inline-block w-full  mb-8">
                  <span className="mb-4 inline-block">

                    Price (USDT)
                  </span><br />
                  <input
                    type="number"
                    id="price"
                    placeholder=""
                    value={prdData?.price || 0}

                    min={0}
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    className="border-[1px] font-sans text-xl focus:outline-none w-full text-gray-700   bg-gray-100 border-gray-100  focus:border-minionBlue px-4 py-1 rounded-md"
                  />
                </label><br />
                <label className="text-gray-700 text-xl  inline-block w-full  mb-8">
                  <span className="mb-4 inline-block">Quantity</span><br />
                  <input
                    type="number"
                    id="quantity"
                    placeholder=""
                    value={prdData?.quantity || 0}
                    min={0}
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    className="border-[1px] font-sans text-xl focus:outline-none w-full text-gray-700   bg-gray-100 border-gray-100  focus:border-minionBlue px-4 py-1 rounded-md"
                  />
                </label><br />
                <label className="text-gray-700 text-xl  inline-block w-full">
                  <span className="mb-4 inline-block">

                    Discount  (USD)
                  </span><br />
                  <input
                    type="number"
                    id="discount"
                    placeholder=""
                    value={prdData?.discount}

                    min={0}
                    max={prdData?.price}
                    onChange={(e) => updatePrdData(e.target.value, e.target.id)}
                    className="border-[1px] font-sans text-xl focus:outline-none w-full text-gray-700   bg-gray-100 border-gray-100  focus:border-minionBlue px-4 py-1 rounded-md"
                  />
                </label>
              </div>
              <label className="relative lg:order-4 order-1 cursor-pointer hover:opacity-70 duration-700 text-gray-700 border-[1px] shadow-xl   bg-gray-100 border-gray-300  focus:border-minionBlue h-fit rounded-xl p-2 inline-block xl:w-[18%] w-[300px] xl:ml-[1%] ml-0 aspect-[1/1] flex-shrink-0 flex-grow-0">
                <img
                  src={featureImg}
                  alt="feature"
                  className="w-full aspect-[1/1] rounded-xl   bg-gray-100 border-gray-100  focus:border-minionBlue"
                />
                <input
                  type="file"
                  id="thumbnail"
                  onChange={(e) => {
                    setFeatureImg(URL.createObjectURL(e.target.files[0]));
                    setImageFile(e.target.files[0]);
                  }}
                  className="hidden"
                />
                <span className="absolute inline-block bottom-0 left-0 w-full py-4 z-1 text-center  rounded-bl-xl rounded-br-xl text-white font-normal bg-minionBlue text-lg animate-pulse">
                  Change Picture
                </span>
              </label>

            </div>
            <button
              type="submit"
              className="flex items-center text-xl gap-3 px-4 py-2  border-minionBlue hover:text-minionBlue hover:bg-white border-[1px] hover:border-minionBlue font-sans  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out ml-auto mr-0 mt-[20px]"
            >
              <FaSave></FaSave> Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
