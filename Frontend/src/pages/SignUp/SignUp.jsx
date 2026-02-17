import "./SignUp.css";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create Your Account</h1>
        <div id="signup-inputs">
          <div className="signup-inputbox">
            <div className="signup-inputbox-heading">
              <i className="fa-regular fa-user"></i>
              <p>Full Name</p>
            </div>
            <input type="text" placeholder="Enter your name" />
          </div>
          <div className="signup-inputbox">
            <div className="signup-inputbox-heading">
              <i className="fa-regular fa-envelope"></i>
              <p>Email</p>
            </div>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="signup-inputbox">
            <div className="signup-inputbox-heading">
              <i className="fa-solid fa-lock"></i>
              <p>Password</p>
            </div>
            <input type="password" placeholder="Enter password" />
          </div>
          <div className="signup-inputbox">
            <div className="signup-inputbox-heading">
              <i className="fa-solid fa-lock"></i>
              <p>Confirm Password</p>
            </div>
            <input type="password" placeholder="Enter password" />
          </div>
        </div>
        <button className="signup-button">Create Account</button>
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
