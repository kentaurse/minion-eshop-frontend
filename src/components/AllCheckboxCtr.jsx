import React, { useEffect, useState, memo } from "react";
const AllCheckboxCtr = ({ checkboxStatus, setCheckboxStatus, label, checkboxIdx }) => {


  const changeHandler = () => {

    if (checkboxStatus === 'some') {
      setCheckboxStatus(false);
    } else {
      setCheckboxStatus(!checkboxStatus)
    }
  }

  return (
    <label className="flex justify-center w-fit gap-x-[10px] h-fit mx-auto">
      <input type="checkbox" className="hidden" onChange={changeHandler} />
      <span className="border border-minionBlue inline-block cursor-pointer w-[30px] aspect-[1/1] relative rounded-md">

        {
          checkboxStatus === 'some' ?

            <span className={`bg-minionBlue absolute w-[60%] aspect-[1/1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm 
            ${checkboxStatus === 'some' ? 'opacity-100 visible rotate-0' : 'opacity-0 invisible rotate-[45deg]'}
            `}></span>
            :
            <svg
              className={`absolute left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2 w-[80%] aspect-[1/1] inline-block duration-700 
                          ${checkboxStatus ? 'opacity-100 visible rotate-0' : 'opacity-0 invisible rotate-[90deg]'}
              `}
              xmlns="http://www.w3.org/2000/svg" width="20.951" height="16.151" viewBox="0 0 20.951 16.151">
              <g id="check" transform="matrix(0.995, -0.105, 0.105, 0.995, 0.555, 3.072)">
                <line id="Line_31" data-name="Line 31" x2="7.462" y2="6.633" transform="translate(0 5.292)" fill="none" stroke="#1b97ae" strokeWidth="3" />
                <line id="Line_32" data-name="Line 32" x1="12.293" y2="11.926" transform="translate(5.804 0)" fill="none" stroke="#1b97ae" strokeWidth="3" />
              </g>
            </svg>
        }

      </span>
      <span>
        {
          label
        }
      </span>
    </label>
  )
}
export default memo(AllCheckboxCtr);