import React from "react";
import { FaSave, FaBackward } from "react-icons/fa";
import { useState, useEffect } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import axios from "axios";
import { Link } from "react-router-dom";
import { showNotification } from "../../redux/headerSlice";
import { useDispatch } from "react-redux";

const Addition = () => {
  const dispatch = useDispatch();
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [errorValidation, setErrorValidation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleForm = async (e) => {
    e.preventDefault();
    if (categoryTitle.length === 0) {
      dispatch(
        showNotification({ message: "Title field is required!", status: 0 })
      );
    } else if (categoryDescription.length === 0) {
      dispatch(
        showNotification({
          message: "Description field is required!",
          status: 0,
        })
      );
    } else {
      try {
        const res = await axios.post(
          process.env.REACT_APP_API_BASE_URL + "/api/user/createcategory",
          { title: categoryTitle, description: categoryDescription }
        );
        if (res.data.error) {
          dispatch(showNotification({ message: res.data.message, status: 0 }));
          setErrorValidation(true);
        } else {
          dispatch(showNotification({ message: res.data.message, status: 1 }));
          setCategoryTitle("");
          setCategoryDescription("");
          setSuccessMessage(true);
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

  useEffect(() => {
    setTimeout(() => {
      setErrorValidation("");
      setSuccessMessage("");
    }, 3000);
  }, [errorValidation, successMessage]);

  return (
    <>
      <div className="bg-white rounded-md shadow-md px-[2rem] py-[2rem] mx-4 h-full">
        <div className="container mx-auto">
          <div className="flex justify-center h-[73vh] items-center">
            <form
              onSubmit={(e) => {
                handleForm(e);
              }}
              className="flex flex-col"
            >
              <label
                htmlFor="categoryTitle"
                className="block text-xl text-gray-700 pt-5"
              >
                Title <span className="text-minionRed pl-[5px]">*</span>
              </label>
              <input
                type="text"
                id="categoryTitle"
                placeholder="Enter the title..."
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}
                className="focus:border font-normal text-lg focus:outline-none bg-gray-100 focus:border-minionBlue pt-1 pl-[10px] pb-1 rounded-md mt-[20px] w-[600px] h-[48px]"
              />
              <label
                htmlFor="categoryDescription"
                className="block pt-[22px] text-xl text-gray-700"
              >
                Description <span className="text-minionRed pl-[5px]">*</span>
              </label>
              <textarea
                type="text"
                placeholder="Enter description..."
                id="categoryDescription"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="focus:border font-normal text-lg focus:outline-none bg-gray-100 focus:border-minionBlue pt-1 pl-[10px] pb-1 rounded-md mt-[20px] w-[600px] h-[200px]"
              />
              <div className="flex gap-3 justify-end pt-[30px]">
                <Link
                  to={"../"}
                  replace={true}
                  type="submit"
                  className="px-4 py-2 pl-2 text-xl hover:text-minionRed hover:bg-white border-[1px] border-minionRed font-sans rounded-md text-white bg-minionRed duration-300 ease-out"
                >
                  <span className="flex items-center pl-2 gap-2">
                    <FaBackward />
                    Back
                  </span>{" "}
                </Link>
                <button
                  type="submit"
                  className="gap-1 px-4 text-xl py-2 pl-2 hover:text-minionBlue hover:bg-white border-[1px] border-minionBlue font-sans rounded-md text-white bg-minionBlue duration-300 ease-out"
                >
                  <span className="flex items-center pl-2 gap-2">
                    <FaSave />
                    Save
                  </span>{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Addition;
