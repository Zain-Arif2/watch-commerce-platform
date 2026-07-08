import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { register, handleSubmit } = useForm();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data).unwrap();

      if (response.success && response.data) {
        dispatch(setCredentials(response.data));
        toast.success("Welcome to ChronoLux");
        navigate("/");
      }
    } catch (error) {
      const errorMsg =
        error?.data?.message || "Failed to register. Please try again.";
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
            Create Account
          </h1>

          <p className="text-[#0b0b0c]/60">
            Join the world of timeless luxury watches
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              {...register("name")}
              required
              className="w-full px-4 py-3 border border-[#c8a45c]/20 bg-white focus:border-[#a6813f] outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              required
              className="w-full px-4 py-3 border border-[#c8a45c]/20 bg-white focus:border-[#a6813f] outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                required
                className="w-full px-4 py-3 pr-12 border border-[#c8a45c]/20 bg-white focus:border-[#a6813f] outline-none transition-all"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0b0b0c]/50 hover:text-[#a6813f] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0b0b0c] hover:bg-[#a6813f] transition-all duration-300 text-white py-3 tracking-wide disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[#0b0b0c]/60">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#a6813f] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;