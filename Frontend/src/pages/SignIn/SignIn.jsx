import "./SignIn.css";
import {Link} from 'react-router-dom'

const SignIn = () => {
  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1>Sign In To GameHoster</h1>
        <div id="signin-inputs">
          <div className="signin-inputbox">
            <div className="signin-inputbox-heading">
              <i className="fa-regular fa-envelope"></i>
              <p>Email</p>
            </div>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="signin-inputbox">
            <div className="signin-inputbox-heading">
              <i className="fa-solid fa-lock"></i>
              <p>Password</p>
            </div>
            <input type="password" placeholder="Enter password" />
          </div>
        </div>
        <button className="signin-button">Sign In</button>
        <p>
          Don't have an account?{" "}
          <span>
            <Link to="/signup" >Sign Up</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
