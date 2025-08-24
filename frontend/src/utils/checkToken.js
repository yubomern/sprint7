// utils/checkToken.js

import { useSelector } from "react-redux";


export async function checkToken() {
  const  {token} = useSelector((state) => state.auth);
  try {
    const tokenheader = localStorage.getItem("token"); // Or from Redux/Context
    console.table (tokenheader) ;
    console.table (token);
    sessionStorage.setItem("toeknheader" ,   tokenheader) ;
    sessionStorage.setItem('token-login' , token);
    if (!token) {
      throw new Error("No token found");
    }

    const res = await fetch("http://localhost:4000/api/check", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.expired) {
        // Auto logout
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      throw new Error(data.message || "Unauthorized");
    }

    const data = await res.json();
    console.log("✅ Token check success:", data);
    return data;
  } catch (err) {
    console.error("❌ Token check failed:", err.message);
    return null;
  }
}
