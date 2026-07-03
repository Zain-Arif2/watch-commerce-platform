import React from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();

      if (response.success && response.data) {
        dispatch(setCredentials(response.data));
        toast.success("Welcome back to ChronoLux");
        navigate("/");
      }
    } catch (error) {
      const errorMsg =
        error?.data?.message ||
        "Failed to login. Please check your credentials.";
      toast.error(errorMsg);
    }
  };

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen flex items-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] font-semibold text-[#a6813f] uppercase mb-3">
            CHRONOLUX
          </p>

          <h1 className="text-4xl font-serif mb-3">
            Welcome Back
          </h1>

          <p className="text-[#0b0b0c]/60">
            Sign in to access your luxury watch collection
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 border border-[#c8a45c]/20 bg-white focus:border-[#a6813f] outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              {...register("password")}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-[#c8a45c]/20 bg-white focus:border-[#a6813f] outline-none transition-all"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0b0b0c] hover:bg-[#a6813f] transition-all duration-300 text-white py-3 tracking-wide disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[#0b0b0c]/60">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#a6813f] font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;