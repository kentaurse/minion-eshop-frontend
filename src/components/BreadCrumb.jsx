import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function BreadCrumb() {
  const location = useLocation();
  const [path, setPath] = useState([]);
  useEffect(() => {
    let abc = location.pathname.split("/");
    abc.shift();
    setPath(abc);
  }, []);
  return (
    <>
      {path.length !== 0 && (
        <ul className="flex justify-start items-center text-2xl px-5 py-3 border-b  border-gray-300">
          <li className="px-2 py-1 text-minionBlue">
            <Link to="/">
              <span className="opacity-50 hover:opacity-100">Home</span>
            </Link>
            <span className="ml-2 cursor-pointer opacity-50 ">
              <svg
                svg
                className="inline-block"
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="16"
                viewBox="0 0 12 16"
              >
                <path
                  id="Path_7"
                  data-name="Path 7"
                  d="M8,0l8,12H0L5.823,3.265Z"
                  transform="translate(12) rotate(90)"
                  fill="#036b7e"
                />
              </svg>
            </span>
          </li>

          {path.map((item, index, arr) => {
            return path.length === index + 1 ? (
              <li className="px-2 py-1 text-minionBlue">
                <span>{item}</span>
              </li>
            ) : (
              <li className="px-2 py-1 text-minionBlue">
                <Link
                  to={`/${path.reduce((total, current, key) => {
                    if (key <= index) return (total = total + "/" + current);
                    else return total;
                  })}`}
                  className="opacity-50 hover:opacity-100"
                >
                  {item}
                </Link>
                <span className="opacity-50 ml-2 cursor-pointer">
                  <svg
                    className="inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="16"
                    viewBox="0 0 12 16"
                  >
                    <path
                      id="Path_7"
                      data-name="Path 7"
                      d="M8,0l8,12H0L5.823,3.265Z"
                      transform="translate(12) rotate(90)"
                      fill="#036b7e"
                    />
                  </svg>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
