import TitleText from "../UI/TitleText";

const Header = () => {
  return (
    <div className="bg-black p-4 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        {/* React Logo */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
          alt="React Logo"
          className="w-10 h-10"
        />
        {/* Plus Sign */}
        <span className="text-white text-3xl font-bold">+</span>
        {/* n8n Logo */}
        <img
          src="https://avatars.githubusercontent.com/u/45487711?s=200&v=4"
          alt="n8n Logo"
          className="w-10 h-10 rounded"
        />{" "}
      </div>
    </div>
  );
};

export default Header;
