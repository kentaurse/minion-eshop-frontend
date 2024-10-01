import React, { memo, useState } from 'react'

const Loader = () => {

  return (
    <div className={`dotLoader w-fit h-fit text-center duration-[2000ms]`}>
      <div className="dotLoader-wrapper">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <br /><br />
      <span className='text-minionBlue text-xl font-[900]'>wait...</span>
    </div>
    // <div className="dot-loading">
    //   <div className="loading-wrapper">
    //     <div></div>
    //     <div></div>
    //     <div></div>
    //     <div></div>
    //     <div></div>
    //     <div></div>
    //   </div>
    // </div>
  )
}
export default memo(Loader);