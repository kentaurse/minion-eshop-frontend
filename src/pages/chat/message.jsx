import React, { useState } from "react";
import LeftSide from "./leftside";
import RightSide from "./rightSide";
import MainSide from "./mainSide";
import { useSelector } from "react-redux";

export default function Message() {

  const [userId, setUserId] = useState() 
  const [roomId, setRoomId] = useState() 
  
  return (
    <div className="flex ">
      <LeftSide getId = {setUserId} />
      <MainSide userId={userId}  roomId={roomId}/>
      <RightSide getId = {setRoomId}/>
    </div>
  );
}
