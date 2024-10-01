import React, { useEffect, useRef, useState } from "react";
import BottomSide from "./bottomSide";

import { FaClock, FaPaperPlane, FaPaperclip } from "react-icons/fa";
import { useSelector } from "react-redux";
import defaultImage from "../../assets/image/message/avatar.png";

export default function MainSide({ userId, roomId }) {
  const { user } = useSelector((store) => store.user);
  const [allContent, setAllContent] = useState([]);
  const { showSide } = useSelector((store) => store.side);
  const [isMargin, setIsMargin] = useState(true);
  const [content, setContent] = useState("");
  const lastMessageRef = useRef(null);

  
  
  const scrollFul = () => {
    if (lastMessageRef.current)
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollFul();
  }, [allContent]);

  useEffect(() => {
    setIsMargin(!showSide);
  }, [showSide]);

  const senMsg = () => {
    window.socket?.emit("C2S_NEW_PUBLIC_MESSAGE", {
      content: content,
      id: user?._id,
    });
    setContent("");
  };

  useEffect(() => {
    window.socket?.emit("C2S_GET_ALL_PUBLICC_MESSAGE");
  }, []);

  window.socket?.on("S2C_NEW_PUBLIC_MESSAGE", (data) => {
    console.log(data);
    setAllContent(data);
  });
  console.log(allContent);
  return (
    <div className="mainArea w-8/12 overflow-y-scroll  bg-white order-gray-400 h-[calc(100vh-180px)]">
      <div className="py-4 px-4">
        {allContent?.res?.map((message, index) => {
          return (
            <div
              key={index}
              className={`flex my-2 gap-6 ${
                message.senderId === user?._id ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <img
                src={
                  message.user[0].avatar === ""
                    ? defaultImage
                    : `${
                        process.env.REACT_APP_API_BASE_URL +
                        "/api/file/download/" +
                        message.user[0].avatar
                      }`
                }
                alt={message.user[0].firstName}
                className="w-12 h-12 rounded-full border-2 border-minionBlue"
              />
              <div
                className={`flex flex-col relative ${
                  message.senderId === user?._id ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`flex flex-col  px-4 py-2  rounded-lg max-w-[720px] ${
                    message.senderId === user?._id
                      ? 'items-start bg-minionBlue text-white after:content-[""] after:absolute after:top-[21%] after:left-[100%] after:mt-[-5px] after:border-[6px]  after:border-transparent after:border-l-minionBlue '
                      : 'items-end text-[#0f2c31] bg-[#e0e0e0] after:content-[""] after:absolute after:top-[21%] after:right-[100%] after:mt-[-5px] after:border-[6px]  after:border-transparent after:border-r-[#e0e0e0] '
                  }`}
                >
                  <p className="break-all">{message.content}</p>
                  <p
                    className={`pt-2 flex items-center gap-2 text-[12px] ${
                      message.senderId === user?._id
                        ? "text-gray-300 "
                        : "text-gray-400"
                    }`}
                  >
                    <FaClock />{" "}
                    {(
                      message.date.toString().split("T")[0] +
                      " " +
                      message.date.toString().split("T")[1]
                    ).slice(0, 19)}
                  </p>
                </div>
                <h3 className="mt-2 text-[#024754]">{message.reporter}</h3>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={`${
          isMargin ? "w-[66%]" : "w-[57%]"
        } fixed ml-1  rounded-md bottom-0 bg-white py-4 px-4 border-t-[1px] flex gap-4 items-center`}
      >
        <textarea
          type="text"
          placeholder="Enter Message..."
          className="ml-6 w-[55vw] bg-[#f5f7fb]  h-12 rounded-xl text-md px-4 py-1 focus:border-[2px] text-[#0f2c31] focus:border-minionBlue focus:outline-none "
          value={content}
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
          onClick={() => {
            senMsg();
          }}
          className="px-5 py-3 bg-minionBlue text-white text-[20px] border-2 border-white rounded-xl cursor-pointer hover:text-minionBlue hover:border-minionBlue hover:bg-white duration-300 ease-linear"
        >
          <FaPaperPlane></FaPaperPlane>{" "}
        </button>
      </div>
      <div ref={lastMessageRef}></div>
    </div>
  );
}
