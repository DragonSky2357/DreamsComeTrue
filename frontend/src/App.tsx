import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DreamPage from "./pages/DreamPage";
import CreatePost from "./pages/CreatePost";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import PostPage from "./pages/PostPage";
import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from "recoil";

import EditProfile from "./pages/EditProfile";
import SearchPage from "./pages/SearchPage";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TagsPage from "./pages/TagsPage";
import FortunePage from "./pages/FortunePage";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <RecoilRoot>
        <CookiesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/dream" element={<DreamPage />} />
              <Route path="/dream/:id" element={<PostPage />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/fortune" element={<FortunePage />} />
              <Route path="/tags/:tags" element={<TagsPage />} />
              <Route path="/:username" element={<ProfilePage />} />
              <Route path="/editProfile/" element={<EditProfile />} />

              {/* <Route path={"*"} element={<NotFound />} /> */}
            </Routes>
          </BrowserRouter>
        </CookiesProvider>
      </RecoilRoot>
    </div>
  );
}

export default App;
