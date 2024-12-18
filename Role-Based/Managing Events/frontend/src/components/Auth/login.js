import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authServices";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginError, setLoginError] = useState("");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const regUsernameRef = useRef();
  const regEmailRef = useRef();
  const regPasswordRef = useRef();

  const onSubmit = async (data) => {
    try {
      setLoginError("");
      const response = await authService.login(data.username, data.password);

      // Store token and user info
      login(response.access_token, response.user_id, response.role);
      // Redirect based on role
      if (response.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      setLoginError(error.message || "Login failed");
    }
  };

  const handleRegisterClick = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    debugger;
    const registerPayload = {
      username: regUsernameRef.current.value,
      email: regEmailRef.current.value,
      password: regPasswordRef.current.value,
    };
    try {
      const response = await authService.register(registerPayload);
      // Handle successful registration
      setIsRegistrationModalOpen(false);
      alert("Register Successfull");
      navigate("/login");
    } catch (error) {
      // Handle registration failure
      setLoginError(error.message || "Registration failed");
    }
  };

  const RegistrationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register New User
        </h2>
        <form onSubmit={handleRegistrationSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="reg-username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                ref={regUsernameRef}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                ref={regEmailRef}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                ref={regPasswordRef}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="submit"
              className="w-full mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm Registration
            </button>
            <button
              type="button"
              onClick={() => setIsRegistrationModalOpen(false)}
              className="w-full ml-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Username is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <button
              onClick={handleRegisterClick}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Register
            </button>
          </p>
        </div>
      </div>

      {/* Registration Modal */}
      {isRegistrationModalOpen && <RegistrationModal />}
    </div>
  );
};

export default Login;
