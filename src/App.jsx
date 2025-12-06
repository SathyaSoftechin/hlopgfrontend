import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import IntroVideo from "./components/IntroVideo";   // NEW
import LoadingVideo from "./components/LoadingVideo";

// Pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import HostelPage from "./pages/HostelPage";
import Popup from "./components/Popup";
import RoleSelection from "./components/RoleSelection";

import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import StudentForgetPassword from "./components/StudentForgetPassword";

import OwnerLogin from "./components/OwnerLogin";
import OwnerSignup from "./components/OwnerSignup";
import OwnerForgetPassword from "./components/OwnerForgetPassword";

import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import UploadPG from "./pages/UploadPG";
import MyPGs from "./pages/MyPGs";

import EditPG from "./pages/EditPG";
import EditRooms from "./pages/EditRooms";
import PGMembers from "./pages/PGMembersList";

import CityHostels from "./pages/cities/CityHostels";
import UserProfile from "./pages/UserPanel";
import Contact from "./pages/Contact";

function App() {
  const location = useLocation();

  // --------------------------
  // 1️⃣ INTRO VIDEO (Plays ONLY once)
  // --------------------------
  const [showIntro, setShowIntro] = useState(() => {
    const seen = localStorage.getItem("seenIntro");
    return !seen; // play only if not seen before
  });

  useEffect(() => {
    if (showIntro === false) {
      localStorage.setItem("seenIntro", "true");
    }
  }, [showIntro]);

  // --------------------------
  // 2️⃣ LOADING VIDEO (route-based)
  // --------------------------
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const path = location.pathname;

    if (path === "/" && !showIntro) {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
      return;
    }

    if (path.startsWith("/hostel/")) {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
      return;
    }

    if (path.startsWith("/city/")) {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
      return;
    }
  }, [location.pathname, showIntro]);

  // --------------------------
  // 3️⃣ SERVER DOWN → loading video
  // --------------------------
  useEffect(() => {
    window.showServerLoader = () => setLoading(true);
    window.hideServerLoader = () => setLoading(false);
  }, []);

  const hideHeaderFooter =
    location.pathname.startsWith("/owner-dashboard") ||
    location.pathname.startsWith("/view");

  return (
    <div className="app-container">

      {/* 🟣 INTRO VIDEO (5 SEC, ONLY ONCE) */}
      {showIntro && <IntroVideo onFinish={() => setShowIntro(false)} />}

      {/* 🔵 LOADING VIDEO (homepage, hostel click, server down) */}
      {!showIntro && loading && <LoadingVideo />}

      {/* HEADER */}
      {!hideHeaderFooter && !showIntro && !loading && <Header />}

      <main className="content">
        {!showIntro && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/hostel/:hostelId" element={<HostelPage />} />

            <Route path="/popup" element={<Popup />} />
            <Route path="/RoleSelection" element={<RoleSelection />} />

            <Route path="/city/:cityName" element={<CityHostels />} />

            <Route path="/StudentLogin" element={<StudentLogin />} />
            <Route path="/student-signup" element={<StudentSignup />} />
            <Route path="/student-forgot-password" element={<StudentForgetPassword />} />

            <Route path="/ownerLogin" element={<OwnerLogin />} />
            <Route path="/ownersignup" element={<OwnerSignup />} />
            <Route path="/owner-forgot-password" element={<OwnerForgetPassword />} />

            <Route path="/user-dashboard" element={<UserProfile />} />
            <Route path="/owner-dashboard" element={<AdminPanel />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/upload-pg" element={<UploadPG />} />
            <Route path="/my-pgs" element={<MyPGs />} />
            <Route path="/edit-pg/:hostel_id" element={<EditPG />} />
            <Route path="/edit-rooms/:hostel_id" element={<EditRooms />} />
            <Route path="/pg-members/:hostel_id" element={<PGMembers />} />
          </Routes>
        )}
      </main>

      {/* FOOTER */}
      {!hideHeaderFooter && !showIntro && !loading && <Footer />}
    </div>
  );
}

export default App;
