import { useState, useEffect, memo } from "react";
import { Route, Routes } from "react-router-dom";
import Article from "./index";
import NotFound from "../notFound";
import SelectedArticle from "./ArticleList/SelectedArticle";

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Article />} />
        <Route path="/:id" element={<SelectedArticle />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};
export default memo(Router);
