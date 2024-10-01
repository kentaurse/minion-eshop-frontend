import { Link } from "react-router-dom";
import { DeleteBtn, EditBtn, ViewBtn } from "../components/Button";
import defaultAvatar from "../assets/image/feature-img.png"
const InventoryItem = ({ index, page, data }) => {
  return (
    <tr className="hover:bg-[#d7f2ff] duration-150 ease-linear border-b-[1px] border-b-[#eaf8ff] even:bg-[#eaf8ff]">
      <td className="text-center py-6 ">{index + 1 + page}</td>
      <td className="text-center py-2 flex flex-row justify-center">
        <div className="w-[48px] h-[48px] object-center border border-white rounded-full">
          <img
            src={
              data?.thumbnail[0]
                ? process.env.REACT_APP_API_BASE_URL +
                  "/api/file/download/" +
                  data?.thumbnail[0]
                : defaultAvatar
            }
            alt=""
            className="w-full h-full rounded-full"
          />
        </div>
      </td>
      <td className="text-center py-6 ">{data.name}</td>
      <td className="text-center py-6 ">{data.category.title}</td>
      <td className="text-center py-6 ">${data.price}</td>
      <td className="py-6 px-4 text-minionBlack text-lg">
        <h3 className=" text-center">{data.remain}</h3>
      </td>
      <td>
        <div className=" m-auto ">
          <Link to={`../transaction?id=${data._id} `} replace={true} onClick={() => true}>
            <ViewBtn />
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default InventoryItem;
