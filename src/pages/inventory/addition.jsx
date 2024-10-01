import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import { data } from "autoprefixer";
import { showNotification } from "../../redux/headerSlice";
import { useNavigate } from "react-router-dom";

export default function Addition() {
  const dispatch = useDispatch();
  const [inventories, setInventories] = useState([]);
  const navigate = useNavigate();
  const [selectProduct, setSelectProduct] = useState("");
  const [selectQuantity, setSelectQuantity] = useState("");
  const [selectPrice, setSelectPrice] = useState("");
  const [selectKey, setSelectKey] = useState("");
  const { user } = useSelector((store) => store.user);
  const [datas, setDatas] = useState([]);


  useEffect(() => {
    getAllproducts();
  }, []);
  const getAllproducts = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/inventory/inventory"
      );

      if (res.data.products.length === 0) {
        setNoProduct("No Product found!");
      }
      setInventories(
        res.data.products.map((item) => {
          return { ...item };
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
  };

  useEffect(() => {
    setDatas(inventories);
  });
  
  const submitForm = async (e) => {
    e.preventDefault();
    if (!selectProduct) {
      dispatch(
        showNotification({
          message: "Select the product!",
          status: 0,
        })
      );
    } else if (!selectQuantity) {
      dispatch(
        showNotification({
          message: "Input amount!",
          status: 0,
        })
      );
    } else {
      try {
    
        const res = await axios.post(
          process.env.REACT_APP_API_BASE_URL +
            "/api/inventory/inventory/transaction/addition",
          { productId: selectKey, price: selectPrice, quantity: selectQuantity }
        );
        if (res.data.error) {
          dispatch(
            showNotification({
              message: res.data.message,
              status: 0,
            })
          );
        } else {
          dispatch(
            showNotification({
              message: res.data.message,
              status: 1,
            })
          );
        }
      } catch {
        dispatch(
          showNotification({
            message: "Server",
            status: 0,
          })
        );
      }
    }
    window.socket.emit("C2S_NEW_NOTIFICATION", {
      user: `${user?.lastName} ${user?.firstName}`,
      email: user?.email,
      product: selectProduct,
      quantity: selectQuantity,
      price: selectPrice,
    });
    navigate("../transaction");
  };


  return (
    <>
      <div className="bg-white rounded-md shadow-md px-[2rem] py-[2rem] mx-4 h-full">
        <div className="container mx-auto">
          <div className="flex justify-center h-[73vh] items-center">
            <form onSubmit={(e) => submitForm(e)} className="flex flex-col">
              <label
                htmlFor="categoryDescription"
                className="block pt-[22px] text-xl text-gray-700"
              >
                Product <span className="text-minionRed pl-[5px]">*</span>
              </label>
              <select
                type="text"
                id="product"
                placeholder="Enter the title..."
                className="focus:border focus:outline-none focus:border-minionBlue pt-2 pl-[10px] pb-2 rounded-[5px] bg-gray-100 mt-[20px] text-lg w-[600px] h-[48px]"
                onChange={(e) => {
                  setSelectProduct(e.target.value);
                  let product = inventories.filter((item) => {
                    if (item.name === e.target.value) {
                      return item.id, item.price;
                    }
                  });
                  setSelectPrice(product[0].price);
                  setSelectKey(product[0]._id);
                }}
              >
                <option value={""}></option>
                {inventories.map((product) => (
                  <option
                    key={product._id}
                    className="bg-base-300 text-sm p-1 rounded-md"
                    value={product.name}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
              <label
                htmlFor="Quantity"
                className="block pt-[22px] text-xl text-gray-700"
              >
                Quantity <span className="text-minionRed pl-[5px]">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                placeholder="Enter the title..."
                className="focus:border bg-gray-100 focus:outline-none focus:border-minionBlue pt-2text-lg  pl-[10px] pb-2 rounded-[5px]  mt-[20px] w-[600px] h-[48px]"
                onChange={(e) => {
                  setSelectQuantity(e.target.value);
        
                }}
              />
              <label
                htmlFor="Price"
                className="block pt-[22px] text-xl text-gray-700"
              >
                Price <span className="text-minionRed pl-[5px]">*</span>
              </label>
              <input
                type="text"
                id="price"
                placeholder="price"
                className="focus:border focus:outline-none focus:border-minionBlue pt-2 pl-[10px] pb-2 rounded-[5px] bg-gray-100 mt-[20px] text-lg w-[600px] h-[48px] cursor-not-allowed"
                disabled
                value={selectPrice * selectQuantity}
              />

              <div className="flex justify-end pt-[30px]">
                <button
                  type="submit"
                  className="  gap-1 px-4 py-2 pl-2 text-minionBlue bg-white border-[1px] border-minionBlue font-sans rounded-md hover:text-white hover:bg-minionBlue duration-300 ease-out"
                >
                  <span className="flex text-xl items-center pl-2 gap-2">
                    <FaSave />
                    Save
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
