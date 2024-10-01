import { Suspense, lazy, useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useNavigate, Route, Routes, Navigate } from "react-router-dom";
import { getAllUsers, getUser } from "./redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./components/Loader"
import checkAuth from "./app/auth";

const PageContent = lazy(() => import("./PageContent"));
const Login = lazy(() => import("./pages/auth/login"));
const Register = lazy(() => import("./pages/auth/register"));
const About = lazy(() => import("./pages/about"));
const NotFound = lazy(() => import("./pages/notFound"));
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      dispatch(getUser());
    } else {
      delete axios.defaults.headers.common["Authorization"];
      navigate("/login");
    }
  }, [token])
  checkAuth();

  return (
    <Suspense
      fallback={
        <div className="rounded-md shadow-md mx-4 h-screen flex justify-center items-center">
          <Loading />
        </div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={token ? "/app/dashboard" : "/login"} replace />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/app/*" element={<PageContent />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
