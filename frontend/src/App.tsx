import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/MainPage";
import CreatePost from "./pages/CreatePost";
import SignUp from "./pages/SingUp";
import SignIn from "./pages/SingIn";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/singup" element={<SignUp />} />
          <Route path="/singin" element={<SignIn />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path={"*"} element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
