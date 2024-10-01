import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { changeShowLayout } from "../redux/sideSlice"
import imgURI from '../assets/img/404.png'

export default function notFound() {
  const dispatch = useDispatch();
  const { isLayout } = useSelector((store) => store.side)
  useEffect(() => {
    dispatch(changeShowLayout({ layout: false }))
  }, [])

  return (
    <section className='rounded-md shadow-md mx-4 h-full bg-white'>
      <img
        src={
          imgURI
        }
        className='w-full h-full object-contain object-center'

        alt="404" />

      <h2 className='header-404 text-[#8882bc] absolute top-[50%] left-[50%] font-[900] drop-shadow-md shadow-[#2c030d] text-[5vw]'>404</h2>
      <Link to='/' className='absolute right-[20%] bottom-[10%] w-[200px] py-[10px] border-minionRed text-minionRed  font-[900] border-[2px] text-center rounded-md'>Go Home</Link>
    </section>
  )
}
