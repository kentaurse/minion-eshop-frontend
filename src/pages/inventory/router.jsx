import { useState, useEffect, memo } from "react";
import { Route, Routes } from "react-router-dom";
import AllItems from "./allItems";
import Addition from "./addition";
import Transaction from "./transaction";
import NotFound from "../notFound";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AllItems />} />
        <Route path="/addition" element={<Addition />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default memo(Router)
