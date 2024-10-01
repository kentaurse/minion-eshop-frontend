import { useState, useEffect, memo } from "react";
import { Route, Routes } from "react-router-dom";
import AllItems from "./allItems";
import Addition from "./addition";
import Edit from "./edit";
import NotFound from "../notFound";

const Router = () => {
  return (
    <>
          <Routes>
            <Route path="/" element={<AllItems />} />
            <Route path="/addition" element={<Addition />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
    </>
  );
}

export default memo(Router)