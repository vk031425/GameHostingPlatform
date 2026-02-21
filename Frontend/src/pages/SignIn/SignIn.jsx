import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../config/api";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const SignIn = () => {
  const navigate = useNavigate();
  const { authData, setAuthData } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post(
        "/user/signin",
        {
          identifier: formData.identifier,
          password: formData.password,
        },
        { withCredentials: true },
      );
      console.log(res.data);
      setAuthData({
        user: res.data.user,
        isLoggedIn: true,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1>Sign In To GameHoster</h1>

        <form className="signin-form" onSubmit={handleSubmit}>
          <div id="signin-inputs">
            <div className="signin-inputbox">
              <div className="signin-inputbox-heading">
                <i className="fa-solid fa-user"></i>
                <p>Email or Username</p>
              </div>
              <input
                type="text"
                name="identifier"
                placeholder="Enter email or username"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signin-inputbox">
              <div className="signin-inputbox-heading">
                <i className="fa-solid fa-lock"></i>
                <p>Password</p>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className="signin-error-text">{error}</p>}

          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <span>
            <Link to="/signup">Sign Up</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
