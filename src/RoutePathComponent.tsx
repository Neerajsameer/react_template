import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation, BrowserRouter, Router, HashRouter } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Users from "./pages/users";
import { useAppSelector } from "./store";
//import Projects from "./pages/Projects";
//import SearchResults from "./pages/SearchResults";
//import AuthLayout from "./pages/AuthLayout";

// const Users = lazy(() => import("./pages/users"));
// const MapView = lazy(() => import("./pages/map_view"));
// const Login = lazy(() => import("./pages/login"));
// const Feedbacks = lazy(() => import("./pages/feedbacks"));

const RoutePathComponent = () => {
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.99,
    },
    in: {
      opacity: 1,
      scale: 1,
    },
    out: {
      opacity: 0,
      scale: 1.01,
    },
  };

  const pageTransition = {
    type: "tween",
    //ease: "anticipate",
    duration: 0.8,
  };
  return (
    <AnimatePresence>
      <Suspense>
        <motion.div initial="initial" exit="out" variants={pageVariants} animate="in" transition={pageTransition}>
          <Routes>
            <Route
              path="/"
              element={
                <RequiredAuth>
                  <Dashboard />
                </RequiredAuth>
              }
            />
            <Route
              path="/login"
              element={
                <AlreadyLoggedIn>
                  <Login />
                </AlreadyLoggedIn>
              }
            />
            <Route
              path="/users"
              element={
                <RequiredAuth>
                  <Users />
                </RequiredAuth>
              }
            />
            <Route path="*" element={<>404</>} />
          </Routes>
        </motion.div>
      </Suspense>
    </AnimatePresence>
  );
};
export default RoutePathComponent;

function RequiredAuth({ children }: any) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AlreadyLoggedIn({ children }: any) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const location = useLocation();

  if (isLoggedIn) return <Navigate to="/" state={{ from: location }} replace />;
  return children;
}
