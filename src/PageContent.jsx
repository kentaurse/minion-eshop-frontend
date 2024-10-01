import { useState, useEffect, memo, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import routes from "./routes";
import { changeShowLayout } from "./redux/sideSlice";
import Loading from "./components/Loader";
import io from "socket.io-client";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import {
  removeNotificationMessage,
  showNotification,
} from "./redux/headerSlice";

const Sidebar = lazy(() => import("./layout/Sidebar"));
const Navbar = lazy(() => import("./layout/Navbar"));
const NotFound = lazy(() => import("./pages/notFound"));

const PageContent = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { isLayout } = useSelector((store) => store.side);
  const { showSide } = useSelector((store) => store.side);
  const { user } = useSelector((store) => store.user);
  const { newNotificationMessage, newNotificationStatus } = useSelector(
    (store) => store.header
  );
  useEffect(() => {
    dispatch(changeShowLayout({ layout: true }));
  }, []);
  useEffect(() => {
    if (newNotificationMessage !== "") {
      if (newNotificationStatus === 3)
        NotificationManager.info(newNotificationMessage, "Info");
      if (newNotificationStatus === 2)
        NotificationManager.warning(newNotificationMessage, "Warning");
      if (newNotificationStatus === 1)
        NotificationManager.success(newNotificationMessage, "Success");
      if (newNotificationStatus === 0)
        NotificationManager.error(newNotificationMessage, "Error");
      dispatch(removeNotificationMessage());
    }
  }, [newNotificationMessage]);
  useEffect(() => {
    window.socket = io.connect(
      `${process.env.REACT_APP_API_SOCKET_URL}/socket`
    );
    window.socket.on("connect", () => {
      if (user) {
        window.socket.emit("C2S_MY_USER_INFO", { id: user?._id });
        window.socket.on("S2C_NEW_NOTIFICATION", (data) => {
          if (user.role !== "user")
            dispatch(showNotification({ message: data.message, status: 3 }));
        });
      }
    });
  }, [user?._id]);
  return (
    <>
      {isLayout && <Sidebar />}
      <div
        className={`${showSide ? "ml-0 lg:ml-[267px]" : "ml-[0]"} duration-500`}
      >
        {isLayout && <Navbar />}
        <div className="mx-auto w-full  h-[calc(100vh-5rem)] overflow-y-auto">
          <Suspense
            fallback={
              <div className="bg-white rounded-md shadow-md px-[2rem] py-[2rem] mx-4 h-full flex justify-center items-center">
                <Loading />
              </div>
            }
          >
            <Routes>
              {routes.map((val, key) => {
                return (
                  <Route
                    key={key}
                    exact={true}
                    path={val.path}
                    element={
                      token ? (
                        <val.component />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                );
              })}
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      <NotificationContainer />
    </>
  );
};
export default memo(PageContent);
