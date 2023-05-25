import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DreamPage from "./pages/DreamPage";
import CreatePost from "./pages/CreatePost";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import PostPage from "./pages/PostPage";
import PrimarySearchAppBar from "./components/TitleBar";
import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from "recoil";
import UserPage from "./pages/Userpage";
import EditProfile from "./pages/EditProfile";
import Modal from "react-modal";
import SearchPage from "./pages/SearchPage";
import KakaoCallback from "./pages/KakaoCallback";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <RecoilRoot>
        <CookiesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dream" element={<DreamPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/p/:id" element={<PostPage />} />
              <Route path="/p/search" element={<SearchPage />} />
              <Route path="/:username" element={<UserPage />} />
              <Route path="/edit/:username" element={<EditProfile />} />
              <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
              {/* <Route path={"*"} element={<NotFound />} /> */}
            </Routes>
          </BrowserRouter>
        </CookiesProvider>
      </RecoilRoot>
    </div>
  );
}

export default App;
