import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

function Navbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logOut();
    navigate("/auth");
  };

  return (
    <nav className="text-white flex justify-around items-center-w-full h-10">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/projects">Projects</NavLink>

      {!auth?.token ? (
        <NavLink to="/auth">Signin/Signup</NavLink>
      ) : (
        <span onClick={handleLogout} className="cursor-pointer">
          Logout
        </span>
      )}
    </nav>
  );
}
export default Navbar;
