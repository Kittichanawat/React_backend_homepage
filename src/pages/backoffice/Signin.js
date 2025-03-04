import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SignIn() {
  const [user, setUser] = useState({ email: '', pass: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let formErrors = {};
    if (!user.email) {
      formErrors.email = "Please enter an email address";
    }
    if (!user.pass) {
      formErrors.pass = "Please provide a password";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post(config.apiPath + '/user/signIn', user);
      if (res.data.token !== undefined) {
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      }
    } catch (e) {
      if (e.response?.status === 401) {
        Swal.fire({
          title: 'Sign In',
          text: 'Username or password invalid',
          icon: 'warning',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: e.message,
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="login-logo">
          <a href="../../index2.html"><b>Admin</b>LTE</a>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>
            <form onSubmit={handleSignIn}>
              <div className="input-group mb-3">
                <input
                
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className={`form-control ${errors.pass ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  value={user.pass}
                  onChange={(e) => setUser({ ...user, pass: e.target.value })}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
                {errors.pass && (
                  <div className="invalid-feedback">
                    {errors.pass}
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                </div>
              </div>
            </form>
            <div className="social-auth-links text-center mb-3">
              <p>- OR -</p>
              <a href="#" className="btn btn-block btn-primary">
                <i className="fab fa-facebook mr-2" /> Sign in using Facebook
              </a>
              <a href="#" className="btn btn-block btn-danger">
                <i className="fab fa-google-plus mr-2" /> Sign in using Google+
              </a>
            </div>
            <p className="mb-1">
              <a href="forgot-password.html">I forgot my password</a>
            </p>
            <p className="mb-0">
              <a href="register.html" className="text-center">Register a new membership</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
