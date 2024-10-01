import React from 'react'
import { useState, useEffect } from 'react';

const STAR_CLASS = new Array(5).fill('text-[#BFBFBF]');

export default function Rate({isEnabled,mark}) {

  const [currentMark, setCurrentMark] = useState(0);
  const [star, setStar] = useState(STAR_CLASS);

  const handler = async (e,key) => {
    if(!isEnabled) {
      return false;
    };
    setCurrentMark(key+1);
  }

  useEffect(()=>{
    setCurrentMark(mark)
  },[mark])
  useEffect(() => {
      setStar(star.map((item, index) => {
        if(index < currentMark) {
          return "text-[#EFFB80]";
        }
        return 'text-[#BFBFBF]';
      }));
    },[currentMark])

    return(
        <div className='flex gap-1'>
          {
            star.map((val, key) => (
              <span key={key} onClick={(e)=>handler(e,key)} className={`star ${val} ${isEnabled && ' hover:text-[#EFFB80]'} `}>
                <svg viewBox="64 64 896 896" focusable="false" data-icon="star" width="30px" height="30px" fill="currentColor" aria-hidden="true"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"></path></svg>
              </span>

            ))
          }
        </div>
    )
}
