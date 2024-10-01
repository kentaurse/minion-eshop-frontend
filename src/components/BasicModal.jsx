import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function BasicModal({ children, isOpen, delItems, onclose }) {
  const [openModal, setOpenModal] = useState();

  const closeModal = () => {
    setOpenModal(false);
    onclose();
  };

  const delHandler = () => {
    delItems();
  };

  useEffect(() => {
    setOpenModal(isOpen);
  }, [isOpen]);

  return (
    <>
      <div
        className={`
        ${
          openModal === true
            ? "fixed top-0 left-0 z-[9999999]  w-[100%] h-[100%] opacity-100 duration-500 ease-linear visible"
            : "opacity-0 duration-300 ease-linear invisible"
        } `}
      >
        <div
          className="w-[100%] h-[100%] bg-minionBlue bg-opacity-40 cursor-pointer"
          onClick={() => closeModal()}
        >
          {" "}
        </div>
        <div className="bg-white absolute left-[50%] top-[10%] translate-x-[-50%] w-[500px] p-6 pb-2 bg-base-100 rounded-xl shadow-xl">
          <div className="relative h-[30px]">
            <button
              className="cursor-pointer text-4xl text-minionBlue absolute top-0 right-0 translate-y-[-10px]"
              onClick={() => closeModal()}
            >
              &times;
            </button>
          </div>
          <div className="px-3">{children}</div>
          <div className="flex justify-end my-4 items-center">
            <button
              onClick={() => delHandler()}
              className="w-28 flex justify-center items-center gap-1 px-4 py-2 hover:text-minionRed hover:bg-white border-[1px] hover:border-minionRed font-sans rounded-md  mx-2 text-white bg-minionRed duration-300 ease-out"
            >
              <FaTrash /> Delete
            </button>
            <button
              className="w-28 flex justify-center items-center gap-1 px-4 py-2 hover:text-minionBlue hover:bg-white border-[1px] border-minionBlue font-sans  rounded-md mx-2 text-white bg-minionBlue duration-300 ease-out"
              onClick={() => closeModal()}
            >
              {" "}
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
