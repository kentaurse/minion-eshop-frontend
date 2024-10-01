import { useState, useEffect } from "react";

export default function Permission({checked, userID, changeUserPermission, disabled}) {
  const [onSwitch, SetOnSwitch] = useState(checked);

  useEffect(() => {
    SetOnSwitch(checked)
  },[userID, checked])
  const changePermission = (e) => {
    if(e.target.checked === true ) {
        SetOnSwitch(true);
    }else {
        SetOnSwitch(false)
    }

    changeUserPermission(e.target.checked, userID)
}

  return (
    <label htmlFor="permission" className="block h-[35px]">
      <input
        onChange={(e) => {
          changePermission(e);
        }}
        checked = {onSwitch}
        disabled = {disabled}
        type="checkbox"
        name="permission"
        id="permission"
        className={`relative h-[28px] w-[58px] appearance-none  bg-gray-400 rounded-[12px] transition duration-[0.5s] 
                    before:absolute before:top-[50%] before:h-[25PX] before:w-[32PX] before:translate-x-[24px] before:translate-y-[-50%] before:rounded-[10px]
                  before:bg-white before:transition before:content-[""] before:text-center before:text-white before:duration-[0.5s] before:
                    checked:bg-minionBlue checked:before:translate-x-[2px] checked:before:bg-white checked:before:content-[""] hover:cursor-pointer`}
      />
    </label>
  );
}
