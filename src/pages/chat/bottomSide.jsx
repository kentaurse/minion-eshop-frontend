import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaPaperclip } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function BottomSide({ getMessageContent }) {
  const { showSide } = useSelector((store) => store.side);
  const [isMargin, setIsMargin] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    setIsMargin(!showSide);
  }, [showSide]);

  const senMsg = ()=>{
    getMessageContent(content)
    setContent('')
  }

  return (
    <div
      className={`${
        isMargin ? "w-[66%]" : "w-[57%]"
      } fixed ml-1  rounded-md bottom-0 bg-white py-4 px-4 border-t-[1px] flex gap-4 items-center`}
    >
      <textarea
        type="text"
        placeholder="Enter Message..."
        className="ml-6 w-[55vw] bg-[#f5f7fb]  h-12 rounded-xl text-md px-4 py-1 focus:border-[2px] text-[#0f2c31] focus:border-minionBlue focus:outline-none "
        value = {content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <div className="relative px-4">
        <input
          type="file"
          className="absolute w-6 h-6 top-0 opacity-0 cursor-pointer"
        ></input>
        <span className=" text-xl text-minionBlue cursor-pointer">
          <FaPaperclip></FaPaperclip>
        </span>
      </div>
      <button
        onClick={() => {senMsg()}}
        className="px-5 py-3 bg-minionBlue text-white text-[20px] border-2 border-white rounded-xl cursor-pointer hover:text-minionBlue hover:border-minionBlue hover:bg-white duration-300 ease-linear"
      >
        <FaPaperPlane></FaPaperPlane>{" "}
      </button>
    </div>
  );
}
