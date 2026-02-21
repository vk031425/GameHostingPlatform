import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../config/api";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/user/signup", {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log(res.data);
      navigate("/signin");
    } catch (error) {
      setError(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create Your Account</h1>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div id="signup-inputs">
            <div className="signup-inputbox">
              <div className="signup-inputbox-heading">
                <i className="fa-regular fa-user"></i>
                <p>Full Name</p>
              </div>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
              />
            </div>

            <div className="signup-inputbox">
              <div className="signup-inputbox-heading">
                <i className="fa-solid fa-at"></i>
                <p>Username</p>
              </div>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                pattern="^[a-z0-9_]+$"
                minLength={3}
                maxLength={20}
              />
            </div>

            <div className="signup-inputbox">
              <div className="signup-inputbox-heading">
                <i className="fa-regular fa-envelope"></i>
                <p>Email</p>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-inputbox">
              <div className="signup-inputbox-heading">
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

            <div className="signup-inputbox">
              <div className="signup-inputbox-heading">
                <i className="fa-solid fa-lock"></i>
                <p>Confirm Password</p>
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className="signup-error-text">{error}</p>}

          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <span>
            <Link to="/signin">Sign In</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
