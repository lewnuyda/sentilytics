import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppButton from "../UI/AppButton";
import TitleText from "../UI/TitleText";
import { supabase } from "../../api/supabaseClient";

const Navbar = ({ toggleSidebar }) => {
  const [userEmail, setUserEmail] = useState("");
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  // 🔹 Get current Supabase session and user email
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserEmail(session.user.email);
      } else {
        navigate("/login");
      }
    };

    fetchUser();

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserEmail(session.user.email);
        } else {
          navigate("/login");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  // 🔹 Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 🔹 Toggle dropdown
  const toggleAdminDropdown = () => {
    setAdminDropdownOpen(!adminDropdownOpen);
  };

  // 🔹 Logout user
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-black text-white relative">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 🔹 Left section — Sidebar Toggle */}
        <div className="flex items-center">
          <AppButton
            onClick={toggleSidebar}
            variant="text"
            className="p-2 text-white hover:bg-black rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fillRule="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </AppButton>
        </div>

        {/* 🔹 Right section — Admin Dropdown */}
        <div className="relative">
          <AppButton
            onClick={toggleAdminDropdown}
            variant="text"
            className="inline-flex items-center gap-1 px-2 py-1 text-white whitespace-nowrap hover:bg-black focus:outline-none"
          >
            <TitleText
              variant="small"
              className="text-white font-semibold uppercase leading-none tracking-normal mb-0"
            >
              Welcome {userEmail || "Guest"}!
            </TitleText>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fillRule="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-4 h-4 ml-1 transition-transform transform ${
                adminDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </AppButton>

          {adminDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
