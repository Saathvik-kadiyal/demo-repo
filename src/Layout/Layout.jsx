import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "../component/Footer.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
     
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
