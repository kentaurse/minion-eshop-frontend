import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";

const ImageWithName = ({ link, imgURI, userName }) => {
  return (
    <Link to={link} className="relative inline-block w-fit h-fit border-white border-[6px] outline outline-[1px] outline-minionBlack rounded-md overflow-hidden hover:opacity-70 duration-300">
      <img src={imgURI} alt={imgURI} className="w-[100px] aspect-[1/1] rounded-md" />
      <span className="absolute bottom-0 left-0 w-full h-1/3 bg-[#1b97ae6b] flex items-center justify-center py-4 text-white">{userName}</span>
    </Link>
  )
};
export default memo(ImageWithName);