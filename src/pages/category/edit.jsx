import React from "react";
import { FaSave, FaTrash, FaBackward } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/headerSlice";

const Edit = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [initTitle, setInitTitle] = useState();

  const catId = params?.id;

  useEffect(() => {
    getcat();
  }, [params, navigate]);

  const getcat = async () => {
    if (!catId) {
      navigate("/");
    } else {
      const res = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/api/user/getcategory/" + catId
      );
      setCategoryTitle(res.data.category.title);
      setInitTitle(res.data.title);
      setCategoryDescription(res.data.category.description);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    if (categoryTitle.length === 0) {
      dispatch(
        showNotification({ message: "Title field is required!", status: 2 })
      );
    } else if (categoryDescription.length === 0) {
      dispatch(
        showNotification({
          message: "Description field is required!",
          status: 2,
        })
      );
    } else {
      try {
        const res = await axios.put(
          process.env.REACT_APP_API_BASE_URL +
            "/api/user/editcategory/" +
            catId,
          {
            title: categoryTitle,
            description: categoryDescription,
            initTitle: initTitle,
          }
        );
        if (res.data.error) {
          dispatch(showNotification({ message: res.data.message, status: 0 }));
        } else {
          dispatch(showNotification({ message: res.data.message, status: 1 }));

          setTimeout(() => {
            navigate("/");
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

  const del = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        process.env.REACT_APP_API_BASE_URL + "/api/user/deletecategory/" + catId
      );
      dispatch(showNotification({ message: res.data.message, status: 1 }));

      setTimeout(() => {
        navigate("/category");
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
        <div className="container mx-auto">
          <div className="flex justify-center h-[73vh] items-center">
            <form>
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
                className="focus:border focus:outline-none focus:border-minionBlue pt-2 pl-[10px] pb-2 rounded-[5px] bg-gray-100 mt-[20px] w-[600px] h-[48px] text-lg"
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
                className="focus:border focus:outline-none  text-lg focus:border-minionBlue pt-2 pl-[10px] pb-2 rounded-[5px] bg-gray-100  mt-[20px] w-[600px] h-[200px]"
              />
              <div className="flex justify-between pt-[30px]">
                <div>
                  <Link
                    to={"/category"}
                    replace={true}
                    type="submit"
                    className="px-4 py-2 pl-2 border-white hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans rounded-md text-white bg-minionRed duration-300 ease-out"
                  >
                    <span className="flex text-xl items-center pl-2 gap-2">
                      <FaBackward />
                      Back
                    </span>{" "}
                  </Link>
                </div>
                <div className="flex">
                  <button
                    onClick={(e) => {
                      del(e);
                    }}
                    type="reset"
                    className="flex items-center gap-1 px-4 py-2  border-white hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans  rounded-md mx-2 text-white bg-minionRed duration-300 ease-out text-xl"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={(e) => {
                      save(e);
                    }}
                    className="  gap-1 px-4 py-2 pl-2 hover:text-minionBlue border-white hover:bg-white border-[1px] hover:border-minionBlue font-sans rounded-md text-white bg-minionBlue duration-300 ease-out"
                  >
                    <span className="flex items-center text-xl pl-2 gap-2">
                      <FaSave />
                      Save
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
