import { Link } from "react-router-dom";
import { DeleteBtn, EditBtn, ViewBtn } from "../components/Button";
import { FaTrash } from "react-icons/fa";
import defaultAvatar from "../assets/image/feature-img.png";
const CartItem = ({ index, page, data }) => {
  console.log('------->>>>>>>>',data)
  return (
    <tr className="hover:bg-[#d7f2ff] duration-150 ease-linear border-b-[1px] border-b-[#eaf8ff] even:bg-[#eaf8ff]">
      <td className="text-center py-6 ">{index + 1 + page}</td>
      <td className="text-center py-2 flex flex-row justify-center">
        <div className="w-[48px] h-[48px] object-center border border-white rounded-full">
          <img
            src={
              data?.product.thumbnail[0]
                ? process.env.REACT_APP_API_BASE_URL +
                  "/api/file/download/" +
                  data?.product.thumbnail[0]
                : defaultAvatar
            }
            alt=""
            className="w-full h-full rounded-full"
          />
        </div>
      </td>
      <td className="text-center py-6 ">{data?.product?.name}</td>
      <td className="text-center py-6 ">{data?.category[0].title}</td>
      <td className="text-center py-6 ">${data?.product?.price}</td>
      <td className="py-6 px-4 text-minionBlack text-lg">
        <h3 className=" text-center">{data.remain}</h3>
      </td>
      <td>
        <div className=" flex justify-center m-auto ">
          <button
            onClick={() => selectDel()}
            className="flex items-center gap-1 px-4 py-2 hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans  rounded-md mx-2 text-white bg-minionRed duration-300 ease-out"
          >
            <FaTrash /> Remove
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CartItem;
