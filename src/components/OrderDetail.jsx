import React, { memo, useState, useEffect } from "react";
import { orderDataConst } from "../mockup/orderDataConst";
import ImageWithName from "./ImageWithName";
import SearchInput from "./SearchInput";
import { FaDatabase } from "react-icons/fa";

const OrderDetail = ({
  orderID,
  isShow,
  onClose,
  orderIndexCnt,
  onConsider,
}) => {
  const [initialDetail, setInitialDetail] = useState();
  const [prdArrays, setPrdArrays] = useState([])
  const [searchVal, setSearchVal] = useState("");
  const [totalQuan, setTotalQuan] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    setInitialDetail(
      orderDataConst.filter((val) => {
        return val.id === orderID
      })[0]
    )
  }, [isShow])
  useEffect(()=>{
    
    setPrdArrays(initialDetail?.prd)
  },[initialDetail])
  useEffect(() => {
    let totalQuanTmp = 0; let totalPriceTmp = 0;
    prdArrays?.map((val) => {
      totalQuanTmp += Number(val.quantity);
      totalPriceTmp += Number(val.quantity) * Number(val.price)
    })
    setTotalQuan(totalQuanTmp)
    setTotalPrice(totalPriceTmp)


  }, [prdArrays])

  useEffect(() => {


    setPrdArrays(
      initialDetail?.prd.filter((val) => {
        return (
          val.name.toLowerCase().search(searchVal.toLowerCase()) > -1 ||
          val.category.toLowerCase().search(searchVal.toLowerCase()) > -1 ||
          val.quantity.toString().search(searchVal.toLowerCase()) > -1 ||
          val.price.toString().search(searchVal.toLowerCase()) > -1 ||
          (Number(val.price) * Number(val.quantity)).toString().search(searchVal.toLowerCase()) > -1 ||
          val.payment.method.toString().toLowerCase().search(searchVal.toLowerCase()) > -1 ||
          val.payment.address.toString().toLowerCase().search(searchVal.toLowerCase()) > -1

        )
      })
    )
    // setInitialDetail(temp)

  }, [searchVal])
  return (
    <div className={`
          fixed left-0 right-0 top-0 bottom-0 bg-[#c6c6c698] z-[9999] duration-100
          ${isShow ? 'visible opacity-100' : 'invisible opacity-0'}
          `}>
      <div className="w-full h-full" onClick={onClose}></div>
      <div
        className={`
                  absolute px-[16px] py-[24px]  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] max-w-[1400px] aspect-video overflow-y-auto bg-white rounded-md shadow-md duration-500 
                  ${isShow ? 'top-1/2' : 'top-1/3'}      
            `}>
        <div className="flex flex-wrap py-2 items-center justify-around relative border-b">
          {
            initialDetail && (

              <ImageWithName link={initialDetail?.user?.link} imgURI={initialDetail?.user?.ImageURI} userName={initialDetail?.user?.userName} />
            )
          }
          <label className="text-[30px]">Order From <span>{initialDetail?.user?.userName}</span></label>
          <span className="text-[#B7B7B7] font-impact text-[20px]">{initialDetail?.date}</span>
          <SearchInput onChange={setSearchVal} searchVal={searchVal} />
          <span
            className="absolute right-4 top-[0] cursor-pointer text-[60px] hover:opacity-60 duration-300"
            onClick={onClose}
          >&times;</span>
        </div>
        <div className="py-4 px-[30px]">
          <div className="py-4">
            <label>Total: {totalQuan} &nbsp;&nbsp; Quantity: <span className="text-minionRed">${totalPrice}</span></label>
          </div>
          <table className="dataTable">
            <thead>
              <tr>
                <th>No</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>

              {
                prdArrays?.length > 0 ?
                  prdArrays.map((val, key) => {
                    return (

                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{val.name}</td>
                        <td>{val.category}</td>
                        <td>{val.price}</td>
                        <td>{val.quantity}</td>
                        <td className="text-minionRed">
                          {val.unit ? val.unit : '$'}{Number(val.price) * Number(val.quantity)}</td>
                        <td>{val.payment.method}: {val.payment.address}</td>
                      </tr>
                    )
                  })
                  :
                  (
                    <tr>
                      <td colSpan={8} className='text-center align-middle'>
                        <FaDatabase className='inline-block mr-4' />
                        No data
                      </td>
                    </tr>
                  )
              }

            </tbody>
          </table>
        </div>
        <div className="w-fit ml-auto mr-0 px-[30px]">
          {/* {
            initialDetail?.prdStatus === 0 && (
              <>

                <button
                  
                  // onClick={onConsider(1,orderIndexCnt)}
                  className="bg-minionBlue mx-1 text-white w-[160px] border border-minionBlue py-2 hover:text-minionBlue hover:bg-white duration-300 rounded-md"
                  >Agree</button>
                <button
                  // onClick={onConsider(-1,orderIndexCnt)}
                  
                  className="bg-minionBlue mx-1 text-white w-[160px] border border-minionBlue py-2 hover:text-minionBlue hover:bg-white duration-300 rounded-md"
                >Refund</button>
              </>
            )
          } */}
          <button
            onClick={onClose}
            className="bg-minionRed mx-1 text-white w-[160px] border border-minionRed py-2 hover:text-minionRed hover:bg-white duration-300 rounded-md"
          >Close</button>
          
        </div>

      </div>
    </div>
  )
}
export default memo(OrderDetail);