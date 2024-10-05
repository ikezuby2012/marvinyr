import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserProfile from "./pages/UserProfile";
import WalletContextProvider from "./pages/WalletProvider";
import ProfilePage from "./pages/ProfilePage";
import Register from "./pages/Signup";
import LoginForm from "./pages/Login";
import { Buffer } from "buffer";

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// Add Buffer to window with error handling
try {
  window.Buffer = window.Buffer || Buffer;
} catch (error) {
  console.error("Error setting up Buffer:", error);
}

const App: React.FC = () => {
  return (
    <WalletContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </WalletContextProvider>
  );
};

export default App;
