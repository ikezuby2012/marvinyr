// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserProfile from "./pages/UserProfile";
import WalletContextProvider from "./pages/WalletProvider";
import ProfilePage from "./pages/ProfilePage";
// import CourseDetails from "./pages/CourseDetail";

const App: React.FC = () => {
  return (
    <WalletContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          {/* <Route path="/courses/:id" element={<CourseDetails() />} /> */}
        </Routes>
      </Router>
    </WalletContextProvider>
  );
};

export default App;
