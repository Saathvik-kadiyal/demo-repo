import { useState } from "react";
import axios from "axios";
import "../styles/LoginPage.css";
import email from "../assets/email.svg";

const backendApi = import.meta.env?.VITE_BACKEND_API || "";
console.log(backendApi)

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log(email,password)

    try {
      const response = await axios.post(`${backendApi}/auth/login`, {
        email,
        password,
      });

      const { access_token, refresh_token, token_type, user_id } =
        response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("email", email);
      localStorage.setItem("isLoggedIn", "true");

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="h-screen w-full bg-[#F4F6F9] flex">

  {/* LEFT SIDE */}
  <div className="relative w-1/2 flex items-center overflow-hidden">

    {/* Large top circle */}
    <div className="absolute -top-64 -left-64 w-[860px] h-[790px] bg-[#BCD6F6] rounded-full z-10"></div>

    {/* Bottom light circle */}
    <div className="absolute -bottom-52 -left-40 w-[550px] h-[550px] bg-[#DCE6F4] rounded-full z-0"></div>

    {/* Text Content */}
    <div className="relative  -top-6 z-20 max-w-lg pl-20">
        <h1 className="font-['Poppins'] font-bold text-[40px]  leading-none tracking-[0%] capitalize text-[#0F3C70] mb-5">
        Track Allowance With <br/>
         Precision
      </h1>

<p className="w-[455px] h-[96px] font-['Poppins'] font-normal text-[16px] leading-[100%] tracking-[0%] text-[#0F3C70]">
        Manage shift allowances across clients and departments with ease.
        <br />
        Get real-time updates, automated calculations, and detailed analytics.
      </p>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="w-1/2 bg-[#F1F5FB] flex items-center justify-center">

   <div className="w-[446px] h-[350px] bg-[#E9F1FC] rounded-[12px] p-8 flex flex-col justify-center">

      {/* Header */}
      <div className="text-center mb-3">
        <h3 className="text-[20px] font-['Poppins'] font-bold text-[#0F3C70]">
          Welcome back
        </h3>
         <p className="text-[14px] text-[#6B7280] mt-1">
          Sign in to access your Shift Allowance Tracker dashboard.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="w-[342px] mx-auto flex flex-col">
        {/* Email */}
         <div className="w-[342px] mx-auto flex flex-col">
         <label className="font-['Poppins'] text-[12px] leading-[100%] tracking-[0%] font-normal text-[#363636] mb-1">
            Enter Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
            required
           className="mt-1 w-[342px] h-[36px] rounded-[4px] px-[12px] py-[10px] bg-white border border-[#5E5E5E] text-sm focus:outline-none mx-auto block"
  />
          
        </div>
   </div>
      
        {/* Password */}
        <div className="w-[342px] mx-auto flex flex-col">
         <label className="font-['Poppins'] text-[12px] leading-[100%] tracking-[0%] font-normal text-[#363636] mb-1">
            Enter Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
           className="h-[36px] rounded-[4px] px-[12px] py-[10px] bg-white border border-[#5E5E5E] text-sm focus:outline-none"
  />
        </div>

        {/* Remember + Forgot */}
       <div className="w-[342px] mx-auto flex justify-between items-center text-sm mt-2">
         <label className="flex items-center gap-1 font-['Poppins'] text-[12px] font-normal text-[#363636]">
            <input type="checkbox" className="w-4 h-4" />
            Remember me
          </label>
          <button type="button" 
           className="font-['Poppins'] text-[12px] leading-[100%] tracking-[0%] font-light text-[#68B0DA]">
            Forgot password?
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
         className="w-[342px] h-[36px] rounded-[4px] px-[16px] py-[8px] bg-[#1C2F72] text-white text-sm font-medium mx-auto block mt-3 disabled:opacity-50"
>
        
          {loading ? "Signing in..." : "Sign In"}
        </button>

      </form>

    

    </div>
  </div>

</div>
  )
};
