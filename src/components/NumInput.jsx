import React, { useEffect, useRef, useState } from "react";
import { TriUp, TriDown } from "./SvgIcon";

export default function NumInput(props) {
 

  const [numVal, setNumVal] = useState(props?.data.numVal);
  const max = props?.data.maxVal;
  const min = props?.data.minVal;
  const incNum = () => {
    if (numVal > max || numVal < min) return setNumVal(0);
    if (numVal < max) return setNumVal(numVal + 1);
  };
  const decNum = () => {
    if (numVal > max || numVal < min) return setNumVal(0);
    if (numVal > min) return setNumVal(numVal - 1);
  };
  useEffect(() => {
    props?.data.onChange(numVal);
  }, [numVal]);
  return (
    <div className="relative flex justify-between rounded border border-r-0 border-minionBlue">
      <input
        type="number"
        sementic="componentNum"
        min={min}
        max={max}
        size={10}
        value={numVal}
        onChange={(e) => {
          if (e.target.value === "") setNumVal("");
          if (
            parseInt(e.target.value) <= max &&
            parseInt(e.target.value) >= min
          )
            setNumVal(parseInt(e.target.value));
        }}
        className="text-minionBlue   border-r-0 bg-transparent py-2 px-3 text-md outline-none transition border-minionBlue active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
      <div>
        <div
          onClick={incNum}
          className="num-up w-[20px] h-[50%] rounded-t border border-minionBlue flex justify-center items-center cursor-pointer hover:opacity-50 duration-500"
        >
          <TriUp />
        </div>
        <div
          onClick={decNum}
          className="num-down w-[20px] h-[50%] rounded-b border border-minionBlue flex justify-center items-center cursor-pointer hover:opacity-50  duration-500"
        >
          <TriDown />
        </div>
      </div>
    </div>
  );
}
