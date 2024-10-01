import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";

const CategoryItem = ({ index, page, data, delCat, changeCheckValue }) => {
  return (
    <tr className=" hover:bg-[#d7f2ff] duration-150 ease-linear border-b-[1px] border-b-[#eaf8ff] even:bg-[#eaf8ff]">
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
      <td className="text-center py-2  px-4 ">{data.title}</td>
      <td className="text-center   py-2   px-4">{data.description}</td>
      <td className="flex items-center justify-center py-2  px-10">
        <Link
          to={`edit/${data._id}`}
          replace={true}
          onClick={() => true}
          className="flex items-center gap-1 px-4 py-2 text-minionBlue bg-white border-[1px] border-minionBlue font-sans  rounded-md mx-2 hover:text-white focus:outline-none hover:bg-minionBlue duration-300 ease-out"
        >
          {" "}
          <FaPencilAlt />
          View
        </Link>
        <div></div>
      </td>
    </tr>
  );
};

export default CategoryItem;
