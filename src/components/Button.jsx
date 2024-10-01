import React, { memo } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
export const DeleteBtn = ({ onDelete }) => {
  return (
    <button
      className="bg-minionBlue border-minionBlue rounded-md border hover:bg-transparent hover:text-minionBlue text-white flex justify-center gap-x-1 items-center py-1 w-[120px] duration-300"
      onClick={onDelete}
    >
      <FaTrash /> Delete
    </button>
  );
};
export const EditBtn = () => {
  return (
    <button className="bg-minionBlue border-minionBlue rounded-md border m-auto hover:bg-transparent hover:text-minionBlue text-white flex justify-center gap-x-1 items-center py-1 w-[120px] duration-300">
      <FaTrash /> Edit
    </button>
  );
};
export const ViewBtn = ({ onView, index, indexCnt }) => {
  return (
    <button
      className="bg-minionBlue border-minionBlue m-auto rounded-md border hover:bg-transparent hover:text-minionBlue text-white flex justify-center gap-x-2 items-center py-2 w-[120px] duration-300"
      onClick={() => {
        index !== undefined && index !== undefined
          ? onView(index, indexCnt)
          : onView;
      }}
    >
      <FaEye /> View
    </button>
  );
};
