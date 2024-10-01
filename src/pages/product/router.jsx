import { useState, useEffect, memo } from "react";
import { Route, Routes } from "react-router-dom";
import AllItems from "./allItems";
import Addition from "./addition";
import Edit from "./edit";
import Detail from "./detail";
import NotFound from "../notFound";
import View from "./view";
import Cart from "./cart";

const Router = () => {
  return (
    <>
          <Routes>
            <Route path="/" element={<AllItems />} />
            <Route path="/addition" element={<Addition />} />
            <Route path="/:id" element={<Detail />} />
            <Route path="/view/:id" element={<View />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
    </>
  );
}
export default memo(Router)