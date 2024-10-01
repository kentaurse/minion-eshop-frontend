import React, { useEffect, useState, memo } from "react";
const Switch = ({ label, stateOfSwitch, changeSwitchState,switchIdx }) => {
  useEffect(() => {
  }, [stateOfSwitch])
  return (
    <div onClick={() => {(switchIdx != undefined) ? changeSwitchState(!stateOfSwitch,switchIdx): changeSwitchState(!stateOfSwitch)}} className="flex items-center">
      <label>{label}</label>

      <div
        className={`
                    text-[0.8em] bg-white 
                    p-2 flex items-center border border-minionBlue rounded-md relative 
                    after:w-1/2 after:h-[80%] after:bg-minionBlue after:absolute after:top-1/2 after:-translate-y-1/2 after:rounded-sm after:shadow-md after: shadow-minionRed after:cursor-pointer after:z-[2] after:duration-[900ms] 
                    ${stateOfSwitch && 'after:left-2 after:translate-x-0'} 
                    ${!stateOfSwitch && 'after:left-[calc(100%-0.5rem)] after:-translate-x-[100%]'} 
                    `
        }>
        <div
          className={`w-[60px] flex-grow-0 flex-shrink-0 flex-auto text-center text-minionBlue cursor-pointer duration-[500ms] relative z-[3] 
                      ${stateOfSwitch ? 'text-white' : 'text-minionBlue'}
                      `}

        >On</div>
        <div
          className={`w-[60px] flex-grow-0 flex-shrink-0 flex-auto text-center text-minionBlue cursor-pointer duration-[500ms] relative z-[3] 
                      ${!stateOfSwitch ? 'text-white' : 'text-minionBlue'}
                      `}
        >Off</div>


      </div>
    </div>
  )
}
export default memo(Switch);