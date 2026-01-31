// frontend/api.jsx
import axios from "axios";

 //export const BASE_URL = "https://hlopgbackend.in";
 
         export const BASE_URL = "http://localhost:5000";



const api = axios.create({
  // baseURL: "https://hlopgbackend.vercel.app/api",
    //baseURL: "https://hlopgbackend.in/api",

        //baseURL: "http://localhost:5000/api",
          baseURL: `${BASE_URL}/api`,


  timeout: 20000, // ⏳ 10 sec max wait (detect slow server)
});

// =============================================
//  GLOBAL REQUEST INTERCEPTOR
//  → Runs BEFORE every API call
// =============================================
api.interceptors.request.use(
  (config) => {
    // Show loading animation BEFORE every request
    if (window.showServerLoader) {
      window.showServerLoader();
    }
    return config;
  },
  (error) => {
    if (window.hideServerLoader) {
      window.hideServerLoader();
    }
    return Promise.reject(error);
  }
);

// =============================================
//  GLOBAL RESPONSE INTERCEPTOR
//  → Runs AFTER API response is received
// =============================================
api.interceptors.response.use(
  (response) => {
    // Hide loader once data arrives
    if (window.hideServerLoader) {
      window.hideServerLoader();
    }
    return response;
  },

  (error) => {
    console.error("🌐 API ERROR:", error);

    // ❌ Server down OR ❌ Network failed
    if (!error.response) {
      console.log("🔴 Server is DOWN or unreachable...");

      if (window.showServerLoader) {
        window.showServerLoader(); // Keep loader visible
      }

      // Optional: Show a fallback message or retry logic
    }

    // Hide the loader after slight delay (smooth transition)
    setTimeout(() => {
      if (window.hideServerLoader) window.hideServerLoader();
    }, 1500);

    return Promise.reject(error);
  }
);

export default api;
