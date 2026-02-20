import { useState } from "react";
import { User, ChevronDown } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Auth } from "../utils/auth";
import { LogOut } from "lucide-react";
import Home from "../assets/home.svg";
import analysis from "../assets/analysis.svg";
import clients from "../assets/clients.svg";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      className="flex justify-between items-center shadow px-4 py-2 relative bg-white"
      style={{ zIndex: 100 }}
    >
      {/* <div className="font-Montserrat font-bold px-2 py-2 rounded">
        Shift Allowance Tracker
      </div> */}

      <div
        style={{
          fontFamily: "'Montserrat Alternates', sans-serif",
          fontWeight: 700,
          fontStyle: "normal",
          fontSize: "20px",
          lineHeight: "29px",
          letterSpacing: "0%",
          color: "#1C2F72",
          width: "255px",
          height: "29px",
          position: "relative",
          top: "0px",
          left: "0px",
          opacity: 1,
        }}
      >
        Shift Allowance Tracker
      </div>

      <nav className=" px-4 py-1">
        <ul className="flex space-x-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive
                  ? "bg-(--nav-bg) text-(--primary-color) shadow-sm"
                  : "text-(--primary-color) hover:bg-indigo-400"
                }`
              }
            >
              <img src={Home} alt="Dashboard" className="w-6 h-6" />
              <p>Overview</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/shift-allowance"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive
                  ? "bg-(--nav-bg) text-(--primary-color) shadow-sm"
                  : "text-(--primary-color) hover:bg-indigo-400"
                }`
              }
            >
              <img src={analysis} alt="Allowance" className="w-6 h-6" />
              <p>Allowance</p>
            </NavLink>
          </li>

          {/* Client Analytics */}
          <li>
            <NavLink
              to="/client-summary"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition ${isActive
                  ? "bg-(--nav-bg) text-(--primary-color) shadow-sm"
                  : "text-(--primary-color) hover:bg-indigo-400"
                }`
              }
            >
              <img src={clients} alt="Clients" className="w-6 h-6" />
              <p>Client analytics</p>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* User Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 z-50 px-2 py-2 bg-white rounded shadow-lg">
            <button
              onClick={Auth.logout}
              className="flex items-center gap-2 text-neutral-700 px-4 py-2 cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
