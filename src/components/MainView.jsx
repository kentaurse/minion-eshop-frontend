import React from "react";
import { Carousel } from "antd";

const MainView = () => (
  <Carousel autoplay>
    <div className="mb-36">
      <img
        src="/image/img/1.png"
        alt="1"
        className="h-[60vh] w-full justify-center  relative transition-all"
      />
    </div>
    <div className="mb-36">
      <img
        src="/image/img/2.png"
        alt="1"
        className="h-[60vh] w-full justify-center  relative transition-all"
      />
    </div>
    <div className="mb-36">
      <img
        src="/image/img/3.png"
        alt="1"
        className="h-[60vh] w-full justify-center  relative transition-all"
      />
    </div>
    <div className="mb-36">
      <img
        src="/image/img/4.png"
        alt="1"
        className="h-[60vh] w-full justify-center  relative transition-all"
      />
    </div>
  </Carousel>
);
export default MainView;
