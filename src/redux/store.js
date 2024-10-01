import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice";
import side from "./sideSlice";
import header from "./headerSlice";
import articleCat from "./articleCatSlice";

const combinedReducer = {
  user,
  side,
  header,
  articleCat,
};

export default configureStore({
  reducer: combinedReducer,
});
