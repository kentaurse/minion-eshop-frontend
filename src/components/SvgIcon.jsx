import React from "react";
export function TriLeft() {
  return (
    <svg
      className="absolute inset-1/2 -translate-x-[50%] -translate-y-[50%]"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="26"
      viewBox="0 0 20 26"
    >
      <path
        id="TriRight"
        d="M13,0,26,20H0Z"
        transform="translate(0 26) rotate(-90)"
        fill="#09BBDC"
      />
    </svg>
  );
}
export function TriRight() {
  return (
    <svg
      className="absolute inset-1/2 -translate-x-[50%] -translate-y-[50%]"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="26"
      viewBox="0 0 20 26"
    >
      <path
        id="TriRight"
        d="M13,0,26,20H0Z"
        transform="translate(20) rotate(90)"
        fill="#09BBDC"
      />
    </svg>
  );
}
export function TriUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="8"
      viewBox="0 0 11 8"
    >
      <path id="numUp" d="M5.5,0,11,8H0Z" fill="#036b7e" />
    </svg>
  );
}

export function TriDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="8"
      viewBox="0 0 11 8"
    >
      <path
        id="numDown"
        d="M5.5,0,11,8H0Z"
        transform="translate(11 8) rotate(180)"
        fill="#036b7e"
      />
    </svg>
  );
}
