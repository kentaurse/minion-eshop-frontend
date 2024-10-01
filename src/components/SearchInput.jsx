import React, { memo, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({ searchVal, onChange }) => {
  useEffect(() => {}, [searchVal]);
  return (
    <label className="relative">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-minionBlue" />
      <input
        type="text"
        placeholder="...Search"
        className="pl-[45px] pr-2 border border-minionBlue py-1 rounded-md focus-visible:outline-none focus-visible:shadow-minionBlue focus-visible:shadow-sm duration-300"
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
};
export default memo(SearchInput);
