import { useState, useEffect, memo } from "react";
import { Route, Routes } from "react-router-dom";
import AllItems from "./allItems";
import Edit from "./edit";
import Detail from "./detail";
import NotFound from "../notFound";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AllItems />} />
        <Route path="/:id" element={<Detail />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default memo(Router)