import React from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";


import Header from "./components/Header";
import Footer from "./components/Footer"; // ✅ Import Footer
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import HostelPage from "./pages/HostelPage";
import Popup from "./components/Popup";
import RoleSelection from "./components/RoleSelection";

// Student Auth
import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import StudentForgetPassword from "./components/StudentForgetPassword";

// Owner Auth
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
// import PaymentsList from "./pages/PaymentsList";
// import Reviews from "./pages/Reviews";
// import MyRooms from "./pages/MyRooms";

// City Hostel Pages
 
import CityHostels from "./pages/cities/CityHostels";


import UserProfile from "./pages/UserPanel";
// Contact Page
import Contact from "./pages/Contact";

function App() {
    const location = useLocation();

  // Hide Header & Footer ONLY on owner-dashboard
const hideHeaderFooter =
    location.pathname.startsWith("/owner-dashboard") ||
    location.pathname.startsWith("/view");
  return (
   <div className="app-container">
 {/* Show Header only if NOT owner dashboard */}
      {!hideHeaderFooter && <Header />}

      <main className="content">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hostel/:hostelId" element={<HostelPage />} />

          
          <Route path="/popup" element={<Popup />} />
          <Route path="/RoleSelection" element={<RoleSelection />} />

          {/* City Hostel Pages */}
        
        {/* City hostels route - reusable */}
        <Route path="city/:cityName" element={<CityHostels />} />

          {/* Student Auth */}
          <Route path="/StudentLogin" element={<StudentLogin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/student-forgot-password" element={<StudentForgetPassword />} />

          {/* Owner Auth */}
          <Route path="/ownerLogin" element={<OwnerLogin />} />
          <Route path="/ownersignup" element={<OwnerSignup />} />
          <Route path="/owner-forgot-password" element={<OwnerForgetPassword />} />


          <Route path="/user-dashboard" element={<UserProfile />} />
          <Route path="/owner-dashboard" element={<AdminPanel />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload-pg" element={<UploadPG />} />

          <Route path="/my-pgs" element={<MyPGs   />} />
<Route path="/edit-pg/:hostel_id" element={<EditPG />} />
<Route path="/edit-rooms/:hostel_id" element={<EditRooms />} />
<Route path="/pg-members/:hostel_id" element={<PGMembers />} />

          {/* 
          <Route path="my-pgs" element={<MyPGs />} />
          <Route path="pg-members-list" element={<PGMembersList />} />
          <Route path="payments-list" element={<PaymentsList />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="my-rooms" element={<MyRooms />} /> */}

        </Routes>
      </main>

     {/* Hide Footer only if owner-dashboard */}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
