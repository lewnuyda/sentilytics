import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isOnSentilyticsPage = location.pathname === "/sentilytics";

  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo Section */}
        <div className="flex items-center gap-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            alt="React Logo"
            className="w-8 h-8"
          />
          <span className="text-xl font-bold">+</span>
          <img
            src="https://avatars.githubusercontent.com/u/45487711?s=200&v=4"
            alt="n8n Logo"
            className="w-8 h-8 rounded"
          />
        </div>

        {/* Right: Navigation Links */}
        <nav className="flex gap-6">
          <Link
            to={isOnSentilyticsPage ? "/" : "/sentilytics"}
            className="hover:underline"
          >
            {isOnSentilyticsPage ? "Home" : "Try it!"}
          </Link>

          <Link to="/about" className="hover:underline">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
