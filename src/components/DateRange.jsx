import React, { useEffect, useState, memo } from "react";
const DateRange = ({ fromDate, toDate, changeFromDate, changeToDate }) => {
  return (
    <div className="flex items-center gap-x-8">
      <label>
        From :
        <input type="date" className="ml-4 border border-minionBlue py-1 px-2 rounded-md focus-visible:outline-none focus-visible:shadow-minionBlack focus-visible:shadow-sm duration-300" value={fromDate} onChange={(e) => changeFromDate(e.target.value)} />
      </label>
      <label>
        To :
        <input type="date" className="ml-4 border border-minionBlue py-1 px-2 rounded-md focus-visible:outline-none focus-visible:shadow-minionBlack focus-visible:shadow-sm duration-300" value={toDate} onChange={(e) => changeToDate(e.target.value)} />
      </label>
    </div>
  )
};
export default memo(DateRange);