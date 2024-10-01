import React, { useEffect, memo } from "react";
const Switch03 = (
  {
    disabled = false,
    stateOfSwitch03,
    changeSwitchState03,
    switch03Idx,
    label = ['OK', 'Unset', 'Refund']
  }
) => {

  return (
    <div
      className={`w-fit 
                  text-[0.8em] bg-white 
                  p-2 flex items-center border border-minionBlue rounded-md relative 
                   after:w-1/3 after:h-[80%] after:bg-minionBlue after:absolute after:top-1/2 after:-translate-y-1/2 after:rounded-sm after:shadow-md after: shadow-minionRed after:cursor-pointer after:z-[2] after:duration-[900ms]  
                   ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer opacity-100'} 
                   ${stateOfSwitch03 === -1 && 'after:left-2 after:translate-x-0'} 
                   ${stateOfSwitch03 === 0 && 'after:left-[50%] after:-translate-x-[50%]'} 
                   ${stateOfSwitch03 === 1 && 'after:left-[calc(100%-0.5rem)] after:-translate-x-[100%]'} 
                  `
      }>
      <div
        className={`w-[60px] flex-grow-0 flex-shrink-0 flex-auto text-center text-minionBlue duration-[500ms]  relative z-[3]  
                    ${stateOfSwitch03 === -1 ? 'text-white' : 'text-minionBlue'}
                    `}
        onClick={() => { if (disabled) { return false } (switch03Idx != undefined) ? changeSwitchState03(-1, switch03Idx) : changeSwitchState03(-1) }}
      >{label[0]}</div>
      <div
        className={`w-[60px] flex-grow-0 flex-shrink-0 flex-auto text-center text-minionBlue duration-[500ms]   relative z-[3] 
                    ${stateOfSwitch03 === 0 ? 'text-white' : 'text-minionBlue'}
                    `}
        onClick={() => { if (disabled) { return false } (switch03Idx != undefined) ? changeSwitchState03(0, switch03Idx) : changeSwitchState03(0) }}>
        {label[1]}
      </div>
      <div
        className={`w-[60px] flex-grow-0 flex-shrink-0 flex-auto text-center text-minionBlue duration-[500ms]  relative z-[3] 
                    ${stateOfSwitch03 === 1 ? 'text-white' : 'text-minionBlue'}
                    `}
        onClick={() => { if (disabled) { return false } (switch03Idx != undefined) ? changeSwitchState03(1, switch03Idx) : changeSwitchState03(1) }}
      >{label[2]}</div>
    </div>
  )
}
export default memo(Switch03);