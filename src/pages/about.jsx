import React, { memo, useEffect, useState, useRef } from "react";
import minion from '../assets/img/about/minion.png'
import shinning from '../assets/img/about/shinning.png'
import { Link } from "react-router-dom";
const About = () => {
  const [coordsX, setCoordsX] = useState();
  const [coordsY, setCoordsY] = useState();
  const [coordsLineX, setCoordsLineX] = useState();
  const [coordsLineY, setCoordsLineY] = useState();
  const [coordsshinningX, setCoordsshinningX] = useState();
  const [coordsshinningY, setCoordsshniningY] = useState();
  const [minionWidth, setMinionWidth] = useState(100);
  const [lineWidth, setLineWidth] = useState(100);
  const sasulPan = useRef();

  const max = 200; const min = 70
  const lineMax = 200; const lineMin = 70
  const minionImg = () => {
    return {
      __html:
        (

          `
          <img 
            src=${minion} alt="minionAni" 
            style='
              left: ${coordsX}px;
              top: ${coordsY}px;
            '/>
        `
        )
    }
  }
  useEffect(() => {
    setInterval(() => {

      setCoordsshinningX(Math.random() * (2000 - 200) + 200)
      setCoordsshniningY(Math.random() * (1000 - 300) + 300)

    }, 100);

    const mycanvas = sasulPan.current;
    const ctx = mycanvas.getContext("2d");

    const cnt = 220,
      x = [], y = [], vx = [], vy = [], w = 1920, h = 1080, r = 4;

    const init = () => {
      for (let i = 0; i < cnt; i++) {
        x[i] = Math.random() * w;
        y[i] = Math.random() * h;
        vx[i] = (0.2 - Math.random()) * 5;
        vy[i] = (Math.random() - 0.2) * 5;
      }
    }

    init();

    const draw = () => {
      ctx.clearRect(0, 0, 1920, 1080);
      for (let i = 0; i < cnt; i++) {
        x[i] += vx[i];
        y[i] += vy[i];
        if (x[i] <= 0 || x[i] >= w) vx[i] = -vx[i];
        if (y[i] <= 0 || y[i] >= h) vy[i] = -vy[i];

        ctx.beginPath();

        ctx.fillStyle = "white"

        ctx.arc(x[i], y[i], r, 0, 2 * Math.PI);
        ctx.fill();

        for (let j = 0; j < cnt; j++) {
          if ((x[i] - x[j]) * (x[i] - x[j]) + (y[i] - y[j]) * (y[i] - y[j]) <= 2000) {
            if ((x[i] - x[j]) * (x[i] - x[j]) + (y[i] - y[j]) * (y[i] - y[j]) <= 26) {
              vx[i] = -vx[i];
              vy[i] = -vy[i];
              vy[j] = -vy[j];
              vx[j] = -vx[j];
            } else {
              ctx.beginPath();
              ctx.moveTo(x[i], y[i]);
              ctx.lineTo(x[j], y[j]);
              ctx.lineWidth = 0.4;
              ctx.strokeStyle = "white";
              ctx.stroke();
            }
          }
        }
      }
    }

    setInterval(draw, 25);
  }, [])
  useEffect(() => {

  }, [coordsX, coordsY])
  const generateMinion = (event) => {
    setMinionWidth(Math.random() * (max - min) + min)
    setLineWidth(Math.random() * (lineMax - lineMin) + lineMin)
    setCoordsX(event.clientX);
    setCoordsY(event.clientY);
  }
  return (
    <>
      <article className="h-screen
         overflow-hidden
         relative 
       bg-[#252D2F] text-white text-[30px]"
        onClick={generateMinion}

      >
        <section className="smooth-up py-[120px] relative z-[10]">
          <div className="mx-auto w-full max-w-[1400px] relative z-[12]">

            <h2 className="text-center text-[72px] font-[900] mb-[100px]">ABOUT US</h2>
            <p className="leading-[3]">We really appreciate visiting our minion-shop.<br />

              The reason we made this service is only one - our Dream, To be greatest business-men.<br />

              There were number of difficulties during development, but Everyone had been cheering up our dev team.<br />

              There is nothing easy to archievement in this world ever, No pain, No gain.<br />

              The history of struggling for bright future will be memorized Gru's, Lucy's, Comrades', and Minions'
            </p>
            <h2 className="text-center text-[72px] font-[900] mt-[200px] mb-[100px]">CAST</h2>
            <ul className="w-fit mx-auto">
              <li>
                <span>Project Manager : </span>
                <div>
                  <p>Harry Potter</p>
                  <p>California University</p>
                </div>
              </li>
              <li>
                <span>Charge of Pagination : </span>
                <div>
                  <p>Heracles</p>
                  <p>University of Ghost</p>
                </div>
              </li>
              <li>
                <span>Charge of UI/UX, Chatting: </span>
                <div>
                  <p>Gru</p>
                  <p>University of Vallian</p>
                </div>
              </li>
              <li>
                <span>Unique Backend engineer: </span>
                <div>
                  <p>Paradise</p>
                  <p>University of Tomato</p>
                </div>
              </li>
              <li>
                <span>Director: </span>
                <div>
                  <p>Magnolia</p>
                  <p>University of Flower</p>
                </div>
              </li>

            </ul>
            <h2 className="text-center text-[72px] font-[900] mt-[200px] mb-[100px]">Real New Engineer</h2>
            <ul className="w-fit mx-auto">
              <li>
                <span>Charge of Chatting : </span>
                <div>
                  <p>Panda</p>
                  <p>Bear University</p>
                </div>
              </li>
              <li>
                <span>Charge of Product : </span>
                <div>
                  <p>Big Bear</p>
                  <p>Bear University</p>
                </div>
              </li>
              <li>
                <span>Charge of Category </span>
                <div>
                  <p>Bob</p>
                  <p>University of Deng</p>
                </div>
              </li>
              <li>
                <span>Shopping Logic: </span>
                <div>
                  <p>Phoenix & SuperSta@</p>
                  <p>University of Logic</p>
                </div>
              </li>


            </ul>
            <h2 className="text-center text-[72px] font-[900] mt-[200px] mb-[100px]">SUPPORT</h2>
            <h3 className="text-center text-[48px] font-[900] mb-[400px]">Senior Developer's Group from 201,508</h3>
            <p className="text-center my-[50vh]">We are so grateful for all Gentlemen who helped us sincerely.</p>
          </div>
        </section>
        <div className="spread-ani absolute top-[100%] left-0 -translate-x-[70%] -translate-y-1/2">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="img-minion">

          <img src={minion}
            style={
              {
                position: "absolute",
                width: `${minionWidth}px`,
                left: `${coordsX}px`,
                top: `${coordsY}px`,
              }

            }
            className=" -translate-x-1/2 -translate-y-1/2 animate-bounce" />
          <img src={minion} alt="minionAni01" />
          <img src={minion} alt="minionAni02" />
          <img src={minion} alt="minionAni03" />
          <img src={minion} alt="minionAni04" />
          <img src={minion} alt="minionAni05" />
          <img src={minion} alt="minionAni06" />
          <img src={minion} alt="minionAni07" />
          <img src={minion} alt="minionAni08" />
        </div>

        {/* <div dangerouslySetInnerHTML={minionImg()} /> */}
        <div className="img-shinning">
          <img src={shinning} alt="shinning"
            style={
              {
                left: `${coordsshinningX}px`,
                top: `${coordsshinningY}px`,
              }
            }
          />
        </div>
        <div className="line-animation">
          <div
            className="lineAni absolute"
            style={
              {
                right: `100px`,
                top: `10%`,
              }
            }
          >

            <div
              className="absolute left-0 top-0 h-[1px] after:absolute after:left-0 after:top-0 after:w-full after:h-full after:bg-white"
              style={
                {
                  // width: `${lineWidth}px`,
                  width: '1000px'

                }
              }
            >

              <img src={shinning} alt="shinningOntoLine"
              />
            </div>
            <div
              className="absolute left-0 top-0 h-[1px] rotate-[270deg]  translate-x-[380px] translate-y-[800px] after:absolute after:left-0 after:top-0 after:w-full after:h-full after:bg-white"
              style={
                {
                  // width: `${lineWidth}px`,
                  width: '1000px'
                }
              }
            ></div>

          </div>
        </div>
        <Link to='/' className="absolute right-4 bottom-4 animate-pulse py-2 px-8 border border-white text-[16px] hover:scale-[1.2] duration-500 z-40">
          Go Back
        </Link>
      </article>
      <div className="bg-[#252D2F] w-[100%] h-[100%]">
        <canvas  className="w-full h-full" ref={sasulPan}></canvas>
      </div>

    </>
  )
}
export default memo(About);