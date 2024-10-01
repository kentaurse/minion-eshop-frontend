import { Link } from "react-router-dom";
import defaultThumnail from "../assets/image/feature-img.png";
import defaultAvatar from "../assets/image/avatar.png";

const TransactionItem = ({ index, page, data, delCat, changeCheckValue }) => {
  return (
    <tr className="hover:bg-[#d7f2ff] duration-150 ease-linear border-b-[1px] border-b-[#eaf8ff] even:bg-[#eaf8ff]">
      <td className="text-center py-2 ">{index + 1 + page}</td>
      {delCat && (
        <td className="text-center py-2  px-4">
          <input
            type="checkbox"
            className="cursor-pointer duration-1000"
            name=""
            id=""
            checked={data.checked}
            onChange={() => changeCheckValue(data._id)}
          />
        </td>
      )}
      <td className="text-center flex justify-center py-4 ">
        <div className="w-[48px] h-[48px] object-center border border-white rounded-full">
          <img
            src={
              data?.Product_transaction?.thumbnail[0]
                ? process.env.REACT_APP_API_BASE_URL +
                  "/api/file/download/" +
                  data?.Product_transaction?.thumbnail[0]
                : defaultThumnail
            }
            alt=""
            className="w-full h-full rounded-full"
          />
        </div>
      </td>
      <td className="text-center py-4 ">{data.Product_transaction.name}</td>
      <td className="text-center flex justify-center py-4 ">
        <div className="w-[48px] h-[48px] object-center border border-white rounded-full">
          <img
            src={
              data?.User_transaction?.avatar[0]
                ? process.env.REACT_APP_API_BASE_URL +
                  "/api/file/download/" +
                  data?.User_transaction?.avatar[0]
                : defaultAvatar
            }
            alt=""
            className="w-full h-full rounded-full"
          />
        </div>
      </td>
      <td className="text-center py-4 ">
        {data.User_transaction.lastName} {data.User_transaction.firstName}
      </td>
      <td className="text-center py-4 ">{data.Category_transaction
.title}</td>
      <td className="text-center py-4 ">{data.price}</td>
      <td className="py-4 px-4 text-minionBlack text-lg">
        <h3 className=" text-center">{data.quantity}</h3>
      </td>
      <td className="py-2 px-4 text-center text-minionBlack text-lg">
        <input
          type="datetime"
          className=" text-center bg-transparent"
          value={(
            data.date.toString().split("T")[0] +
            " " +
            data.date.toString().split("T")[1]
          ).slice(0, 19)}
          disabled
        ></input>
      </td>
    </tr>
  );
};

export default TransactionItem;
